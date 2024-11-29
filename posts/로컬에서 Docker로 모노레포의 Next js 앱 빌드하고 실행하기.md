---
title: Docker로 모노레포의 Next.js 앱 빌드하고 실행하기
description: Docker로 모노레포에 있는 Next.js 앱을 빌드하고 실행해봅시다.
date: 2024-11-28 14:32:21
published: true
slug: build-and-run-nextjs-monorepo-with-docker
tags:
  - Docker
  - Teamcity
  - CI/CD
---

> pnpm workspace + turborepo로 구성한 모노레포 환경을 기반으로 작성된 글입니다.

## 목표

- 로컬에서 Docker를 이용하여 모노레포에 있는 Next.js 앱을 빌드하고 실행해본다.

## Dockerfile

일단 작성한 Dockerfile은 아래와 같다. [멀티 스테이지 방법](https://hanyunseong-log.dev/post/what-is-docker-multi-stage-build)을 사용하여 이미지를 생성했고 스테이지 단위로 자세히 알아보자.

```docker
FROM node:20.11.0-alpine3.19 AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=web --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=web

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
```

### base stage

```docker
FROM node:20.11.0-alpine3.19 AS base
```

1. 사용할 node 버전은 20.11.0이다. alpine은 최소 단위의 Linux 이미지다.

### builder stage

```docker
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=web --docker
```

1. `RUN apk add --no-cache libc6-compat`를 수행하여 Node.js process.dlopen 사용에 필요한 공유 라이브러리가 alpine 버전에 없는 문제를 해결한다.
2. turbo를 글로벌로 설치해준다.
3. [**turbo prune**](https://turbo.build/repo/docs/reference/prune)으로 빌드할 애플리케이션과 그 종속성만 포함하도록 가지치기하여 빌드를 최적화한다.

### installer stage

```docker
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=web
```

1. builder 스테이지에서 turbo prune으로 생성된 out 폴더에 있는 파일들을 복사한다.
2. corepack을 활성화 하여 package.json에 명시된 패키지 매니저를 사용하도록 한다.
3. pnpm install로 종속성을 설치한다.
4. builder 스테이지에 web 애플리케이션의 전체 소스를 복사한다.
5. turbo로 web 애플리케이션을 빌드한다.
   - 이때, next.config에 `output: "standalone"` 옵션을 사용하여 프로덕션 배포에만 필요한 파일만 생성하도록 해둔다. 이렇게 하면 배포 크기를 줄이는 데 큰 도움이 된다.
   - 참고 링크 → [next-config-output](https://nextjs-ko.org/docs/pages/api-reference/next-config-js/output)

### runner stage

```docker
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
```

1. 시스템 group, user를 생성하고 nextjs 사용자로 전환하여 실행한다.
   - 왜 group, user를 생성하고 nextjs 사용자로 전환해서 실행하는지?
     - 결론부터 말하면 보안을 강화하기 위함이다. 컨테이너 내부에서 애플리케이션이 루트 권한으로 실행되면 애플리케이션의 취약점을 악용하여 시스템 전체에 악영향이 끼치는 것을 방지하기 위해서다.
2. installer 스테이지에서 next 설정 파일과 package.json을 현재 스테이지로 복사한다.
3. installer 스테이지에서 빌드 결과물, 정적 파일, public 폴더를 복사한다. 이때 소유자를 nextjs:nodejs로 설정한다.
   - `output: standalone` 옵션을 사용하여 빌드했기 때문에 이때 복사되는 파일들은 프로덕션에만 필요한 파일들이다.
4. 애플리케이션을 실행한다.

### 정리

- 멀티 스테이지 빌드로 불필요한 파일들을 가지치기 하여 이미지의 크기를 줄였다.
- 시스템 사용자를 사용하도록 하여 시스템 보안을 강화하였다.

## 실행

이제 Dockerfile도 작성했겠다 한번 이미지를 생성해서 컨테이너를 띄워보자.

```bash
docker build -f apps/web/Dockerfile -t web-app .
```

필자의 경우 apps/web에 Dockerfile을 두었기 때문에 프로젝트 루트 폴더에서 docker 명령어를 실행할 때
`-f` 옵션을 활용하여 사용할 Dockerfile의 경로를 지정해주었다.

만약 프로젝트 루트 폴더에 Dockerfile이 있다면 `-f apps/web/Dockerfile` 이 부분은 없어도 된다.

자 그럼 저 명령어를 입력해서 이미지를 생성해보자.

![image.png](/post/build-and-run-nextjs-monorepo-with-docker/image.png)

`docker image ls` 커맨드를 입력해서 이미지의 리스트를 확인해보자. 위에서 이미지 이름으로 해두었던 web-app을 볼 수 있다.

```bash
docker run -d --name web -p 3000:3000 web-app
```

생성된 이미지를 실행하기 위해 위 명령어를 입력한다.

- `-d` 옵션을 사용하여 백그라운드에서 실행하게 하여 터미널을 종료해도 컨테이너가 종료되지 않도록 한다.
- `-p` 옵션을 사용하여 포트 포워딩을 설정할 수 있다.
  - \{host port number\}:\{container port number\}/protocal
  - 참고 링크 → [https://docs.docker.com/engine/network/drivers/overlay/#publish-ports](https://docs.docker.com/engine/network/drivers/overlay/#publish-ports)

![image.png](/post/build-and-run-nextjs-monorepo-with-docker/image1.png)

이제 localhost:3000으로 접속해보면 만든 애플리케이션이 나오게 된다.

## Teamcity

필자가 근무하고 있는 회사는 [teamcity](https://www.jetbrains.com/ko-kr/teamcity/)를 CI/CD 툴로 사용하고 있다. 그래서 teamcity에서 dockerfile 경로와 context folder를 지정하는 방법에 대해서도 간단히 적어봤다.

### Build steps > Docker build 설정

![image.png](/post/build-and-run-nextjs-monorepo-with-docker/image2.png)

Docker file 경로를 지정하고 Context folder를 지정할 수 있다.

위에서도 말했지만 필자의 경우 앱별로 Dockerfile을 두어 사용하고 있어 위에서 봤던 docker build 시 넣었던 Dockerfile 경로와 context folder의 값을 그대로 넣었다.

## 참고

- [[Turborepo] Add a with-docker-pnpm example #5462](https://github.com/vercel/turborepo/issues/5462#issuecomment-1621821402)
- [Teamcity On-premises - Docker](https://www.jetbrains.com/help/teamcity/docker.html#Docker+Command)

---
title: Docker build - Multi-stage builds(멀티 스테이지 빌드)
description: Docker multi-stage build에 대해서 알아봅시다
date: 2024-11-28 13:32:21
published: true
slug: what-is-docker-multi-stage-build
tags:
  - Docker
---

# Docker build - Multi-stage builds(멀티 스테이지 빌드)

## 목표

- **Multi-stage builds(**멀티 스테이지 빌드)가 무엇인지 알아본다.
- 멀티 스테이지 빌드를 사용해보고 적용 전/후의 이미지 크기를 비교해본다.

## **Multi-stage builds란?**

Dockerfile 내에서 **여러 개의 빌드 단계를 정의하여 이미지를 생성**하는 방법이다. 빌드 단계에는 필요하지만 애플리케이션 구동에는 필요없는, 다시 말하면 **애플리케이션 실행에 필요한 최소한의 구성만 포함하여 이미지 크기를 최소화**할 수 있다.

![multi-stage-build.png](/post/what-is-docker-multi-stage-build/multi-stage-build.png)

## 왜 사용하나요?

### Docker 이미지 크기 최소화

![image.png](/post/what-is-docker-multi-stage-build/image.png)

web-app-big은 멀티 스테이지를 사용하지 않았고 그 아래 web-app은 멀티 스테이지 빌드를 사용했다. 사이즈를 비교해보면 **이미지 사이즈가 약 80.72%가 감소하였다.**
(참고로 두 앱 모두 next.js standalone을 적용했다)

1. 비용 절감 효과
   - 이미지 저장에 필요한 공간이 줄어들어 디스크 용량을 아낄 수 있다.
   - 네트워크 대역폭 사용을 최소화하여 네트워크 비용을 줄인다.
2. 보안 강화
   - 불필요한 개발 종속성들이 제외되어 잠재적인 취약점이 감소하여 공격 표면이 줄어든다.

## 예제

### Next.js

```
# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.staging.sample .env.production
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
```

## 정리

멀티 스테이지 빌드는 Docker에서 이미지를 생성할 때 여러 단계의 빌드 과정을 거쳐 최종 이미지의 크기를 최소화하는 기술이다. 주요 장점은 다음과 같다:

- **효율적인 이미지 크기 관리:** 빌드에만 필요한 도구와 의존성을 제외하고, 실행에 필요한 최소한의 구성만 포함하여 이미지 크기를 대폭 줄일 수 있다.
- **비용 절감:** 이미지 저장 공간과 네트워크 대역폭 사용량이 감소하여 운영 비용이 절감된다.
- **보안 강화:** 불필요한 개발 도구와 종속성이 제거되어 보안 취약점이 감소한다.

실제 Next.js 프로젝트에 멀티 스테이지 빌드를 적용한 결과, 이미지 크기가 약 80% 이상 감소하는 효과를 확인할 수 있었다.

## 참고

- [Docker - Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [How to Build Smaller Container Images: Docker Multi-Stage Builds](https://labs.iximiuz.com/tutorials/docker-multi-stage-builds)
- [Next.js 예제](https://github.com/vercel/next.js/blob/canary/examples/with-docker-multi-env/docker/staging/Dockerfile)

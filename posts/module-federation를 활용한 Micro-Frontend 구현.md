---
title: Module-Federation를 활용한 Micro-Frontend 구현 (Next.js)
description: Next.js 앱에 module-federation을 적용하여 micro-frontend를 구현해보자
date: 2024-06-05 09:35:47
published: true
slug: micro-frontend-by-nextjs-module-federation
tags:
  - Next.js
  - module-federation
  - micro-frontend
  - msa
  - 마이크로 프론트엔드
  - 마이크로서비스
  - module-federation/nextjs-mf
---

> 현 회사에서 마이크로 프론트엔드 구조를 적용하기 위해 기존 Next.js 앱에 modoule-federation을 사용하여
> 마이크로 프론트엔드 구조를 구현한 포스팅입니다.

구현한 내용을 보기 전에 간단하게 마이크로 프론트엔드 구조를 왜 쓰는지, 어떤 기법들이 있는지 간략하게 알아보자

## micro-frontend란?

앱에 독립적으로도 구동하고 기능을 추가할 수 있으며 이러한 앱들을 모아 더 큰 하나의 앱을 구성하는 구조다.

### 이걸 왜 쓰나?

서비스가 커지고 회사의 규모가 커지면 서비스에 참여하는 작업자가 많아지고 팀이 세분화되는 경우가 있다.  
이런 경우에 팀별로 특정 모듈만 관리할 수 있다면 좋은데 그렇게 관리를 하기 위해선 서비스도 팀에 맞게 쪼개져 있어야 한다.

그리고 작은 변경 사항에도 영향 범위가 광범위해질 수 있고 예측 범위도 점점 커져서 변경에 대한 리스크가 커지는데  
이때 서비스를 쪼깬다면 변경 사항에 대한 영향 범위를 줄일 수 있고 리스크도 같이 줄일 수 있다.

서비스를 한 개로 관리하는 게 아닌 여러 개의 서비스로 관리를 하는 게 마이크로 프론트엔드다.

> **Micro frontends를 구현하는 방법에는 아래 5가지가 있다.**
>
> 1. Server-side template composition
> 2. Build-time integration
> 3. Run-time integration via iframe
> 4. Run-time integration via Web Components
> 5. **Run-time integration via Javascript**

필자는 Micro frontends 아키텍처를 구현하는 방법 중 javascript를 통한 런타임 통합을 선택했다.

## Javascript를 통한 런타임 통합

![img-1](/post/micro-frontend-by-module-federation/img-1.webp)

개별적으로 빌드하여 배포할 수 있고 Javascript 코드를 비동기 방식으로 불러와서 사용하는 방식이다.

컨테이너 어플리케이션에서 각 서비스를 필요할 때 호출하여 렌더링한다.  
빌드 타임 통합과 달리 독립적으로 서비스를 배포할 수 있고  
런타임에 통적으로 서비스를 로드하여 사용하기 때문에 유연하다.

> [webpack 5-module-federation-plugin](https://webpack.kr/plugins/module-federation-plugin/)은 Javascript를 통해 런타임 통합을 하는 플러그인이다.

## Next.js + module-federation

module federation에서는 다양한 플러그인이 있는데 그 중 next.js를 위한 [@module-federation/nextjs-mf](https://www.npmjs.com/package/@module-federation/nextjs-mf)는 next.js에 module-federation을 사용할 수 있도록 해주는 플러그인이다.

shared property에 기본적인 라이브러리의 설정(next, react 등..)을 singleton으로 제공하도록 미리 설정이 되어있다.

### 설치

일단 라이브러리를 설치해보자.

```shell
npm i @module-federation/nextjs-mf
or
yarn add @module-federation/nextjs-mf
or
pnpm add @module-federation/nextjs-mf
```

### 설정

먼저 host 역할을 하는 container와 remote app인 app1, app2 이렇게 총 3개의 모듈로 나눠서 서비스를 만든다고 가정해보자  
container의 next.config.js 설정부터 해보자

```js
const NextFederationPlugin = require("@module-federation/nextjs-mf");

const nextConfig = {
  // ...
  webpack(config, options) {
    const location = options.isServer ? "ssr" : "chunks";

    config.plugins.push(
      new NextFederationPlugin({
        name: "container",
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          app1: `app1@${APP1_URL}/_next/static/${location}/remoteEntry.js`,
          app2: `app2@${APP2_URL}/_next/static/${location}/remoteEntry.js`,
        },
        exposes: {
          // ...
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
```

SSR을 위해서 remotes에 server인 경우와 아닐 때의 location 값을 다르게 하여 remoteEntry를 가져오도록 했다.

> module-federation은 container, remote 상관 없이 remotes, exposes가 가능하지만 그렇게 될 경우에
> 복잡도가 증가하므로 최대한 container는 exposes 하지 않고 remote 앱만 가져와서 사용하도록 했다.

remote app의 next.config.js 설정을 봐보자

```js
const NextFederationPlugin = require("@module-federation/nextjs-mf");

const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    const location = options.isServer ? "ssr" : "chunks";

    config.plugins.push(
      new NextFederationPlugin({
        name: "app1",
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          container: `container@${CONTAINER_URL}/_next/static/${location}/remoteEntry.js`,
        },
        exposes: {
          "./app1-home": "./src/pages/index.tsx",
          "./app1-detail": "./src/pages/[id]/index.tsx",
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
```

remote app에서는 2개의 페이지를 expose했다.

## 적용

이렇게 설정과 페이지를 구성했으니 container에서 app1에 페이지를 가져와서
/app1에는 app1-home 페이지를 보여주고 /app1/[id]에선 app1-detail를 보여주는 작업을 해보자

container에 pages 폴더에 app1/index.tsx를 만들고 아래와 같이 작성한다.

```tsx
import App1Home from "app1/home";

export default function App1Home() {
  return <App1Home />;
}
```

app1에 home으로 expose한 `src/pages/index.tsx`의 내용이 보인다면 성공이다.

#### typescript를 적용하고 싶은 경우

아쉽게도 타입을 직접 지정해줘야 하는 단점이 존재한다. 그래서 필자의 경우 아래와 같이 구성했다.  
컴포넌트의 props와 상세한 타입을 지정해주면 좋겠지만 페이지 단위로 가져오는 경우 굳이 필요없을 것 같아서  
그렇게 상세한 타입은 명시하지 않았다.

```ts
///<reference types="react" />

declare module "app1/*" {
  const Component: any;

  export default Component as any;
}

declare module "app2/*" {
  const Component: any;

  export default Component as any;
}
```

#### App router를 사용하고 싶은 경우

[not supported app routing in @module-federation/nextjs-mf](https://github.com/module-federation/core/issues/1183#issuecomment-2003744775)  
해당 이슈를 보면 이 플러그인을 만든 개발자가 앱 라우터는 지원하지 않는다고 했다.

## 동작 방식

위에서 설명한 것처럼 module-federation은 Javascript를 통한 런타임 통합 기법이다.  
개별적으로 빌드된 자바스크립트 코드를 불러와서 사용하는 방식이라고 했는데 이 부분에 대해서 살펴보자

module-federation이 적용된 곳에서 network 탭을 키고 본다면 더욱 빠르게 이해할 수 있을 것이다.

런타임에서 host인 container에서 remote 앱들의 코드를 사용하려면 빌드 결과물이 필요하고 받아올 수 있어야 한다.  
보면 host인 container에서 remotes 설정을 하였는데 저 경로의 javascript 코드를 불러와서 host에서 원격 모듈을 사용하는 것이다.

![img-2](/post/micro-frontend-by-module-federation/img-2.png)

## 정리

마이크로 프론트엔드 구조의 가장 큰 장점은 앱의 관리를 세분화하여  
제품의 퀄리티를 높힐 수 있다는 점이라고 본다.  
규모가 크고 복잡한 서비스를 개발할 때 A팀이 개발한 기능에  
B팀의 도메인 혹은 기능이 엮이는 상황이 발생하면  
그 코드를 만든 개발자를 찾아가 질문하고 이런 커뮤니케이션 비용이 꽤 많이 든다.

이를 마이크로 프론트엔드 구조를 적용하여 앱을 나누고  
하나의 앱의 수정이 전체 서비스에 영향을 받지 않도록 최소화하여  
변경에 대한 영향 범위를 줄이고 이로 유지보수성을 증가시킬 수 있고  
서비스를 개선하고 퀄리티를 높힐 수 있는 부분이라고 생각한다.

현 회사에서 여러 도메인이 하나의 서비스에 담겨야 하는 걸  
이 구조를 적용하여 개발의 편리성을 증가시켰고 유지보수에 꽤 용이하다고 느꼈다.

조직 변경에 따라 앱의 단위를 바꾸고 유연한 구조를 가진 부분도 큰 장점이라고 생각하기 때문에  
이러한 점이 마음에 든다면 마이크로 프론트엔드를 너무 거창하게 생각하지 말고 일단 적용해봐도 좋을 것 같다.

## 참고

- [martin fowler - micro-frontends](https://martinfowler.com/articles/micro-frontends.html)
- [maxkim - runtime-integration-micro-frontends](https://maxkim-j.github.io/posts/runtime-integration-micro-frontends/)

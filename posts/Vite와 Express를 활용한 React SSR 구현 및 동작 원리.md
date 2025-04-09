---
title: Vite와 Express를 활용한 React SSR 구현 및 동작 원리
description: Vite에서 제공하는 SSR 기능이 어떻게 동작하는지 분석하고 실행해보자.
date: 2025-04-09 17:30:21
published: true
slug: react-ssr-with-vite-express
tags:
  - React
  - Vite
  - Express
  - SSR
---

## 개요

Vite에서 제공하는 SSR 기능을 사용하고 분석해보자.

## 설치

[`create-vite`](https://ko.vite.dev/guide/#scaffolding-your-first-vite-project)를 실행하고 옵션 Others → Extra Vite Starters → ssr-react

## 의존성

```json
{
  "dependencies": {
    "compression": "^1.8.0",
    "express": "^5.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sirv": "^3.0.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.13.4",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react-swc": "^3.8.0",
    "cross-env": "^7.0.3",
    "typescript": "~5.7.3",
    "vite": "^6.1.1"
  }
}
```

package.json에서 dependencies와 devDependencies 부분만 발췌했다.
눈의 띄는 의존성들을 살펴보도록 하자.

### dependencies

- 서버 구동을 위한 [express](https://expressjs.com/ko/)
- 데이터를 압축하기 위한 Node.js 압축 미들웨어인 [compression](https://github.com/expressjs/compression)
  - 왜 압축을 하는지에 대해서는 이곳을 참고 [HTTP Compression](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression)
- 정적 assets에 대한 요청을 처리하기 위한 [sirv](https://www.npmjs.com/package/sirv)

### devDependencies

- 환경 변수 설정과 사용을 플랫폼에 구애받지 않고 동일한 방법으로 할 수 있도록 하는 [cross-env](https://www.npmjs.com/package/cross-env)

## 구조

```json
- index.html
- server.js
- src/
	- entry-client.tsx
	- entry-server.tsx
```

### index.html

- entry-client를 가져오는 구문과 서버에서 렌더링된 페이지를 삽입할 때 어디에 삽입하는지 표시해두는 자리 표시자를 포함한다.
  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite + React + TS</title>
      <!--app-head-->
    </head>
    <body>
      <div id="root"><!--app-html--></div>
      <script type="module" src="/src/entry-client.tsx"></script>
    </body>
  </html>
  ```

### entry-client

→ DOM element에 애플리케이션을 마운트하는 역할을 수행한다.

```tsx
import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <App />
  </StrictMode>
);
```

- hydrateRoot는 서버(react-dom/server)에서 생성된 HTML에 React 컴포넌트를 표시할 수 있도록 함.
  > **Hydrate**는 서버에서 미리 생성된 HTML을 브라우저에서 다시 React와 연결하여 **사용자 상호작용이 가능하도록 JavaScript Event 및 state를 부착하는 과정**이다.

### entry-server

→ `react-dom/server`에서 제공하는 API를 사용하여 앱을 렌더링하는 역할을 수행한다.

```tsx
import { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import App from "./App";

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <App />
    </StrictMode>,
    options
  );
}
```

- renderToPipeableStream은 React 컴포넌트를 HTML로 변환하고 파이프 가능한 Node.js Stream으로 렌더링한다.
  > **Node.js Stream**
  > 데이터를 한번에 처리하지 않고 **잘게 나누어**(chunk 단위로) **점진적으로 읽거나 쓸 수 있도록** 만들어진 데이터 흐름 처리 방식이다.
  >
  > **Stream을 왜 쓰는가?**
  >
  > 메모리를 효율적으로 사용하기 위해서다. 데이터를 한 번에 메모리에 담아서 처리하면 메모리 사용량이 크게 증가하여 비효율적이고 데이터의 크기가 메모리보다 큰 경우 처리 자체가 불가능할 수도 있다. 반면 **Stream은 데이터를 작은 단위(chunk)로 쪼개 점진적으로 처리하므로 메모리를 절약할 수 있다.**
  > 그리고 큰 데이터를 한 번에 로딩하면 처리에 오랜 시간이 걸려 사용자는 데이터가 모두 로딩될 때까지 기다려야 하지만, Stream을 사용하면 **데이터가 도착하는 즉시 처리가 시작되므로 빠른 응답이 가능해진다.**

### server.js

> 애플리케이션 서버

```jsx
import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    let didError = false;

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

        res.write(htmlStart);

        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });

        pipe(transformStream);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
```

전체 코드에서 주요 부분들을 자세히 봐보자.

#### 템플릿 캐싱

```js
// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";
```

- 개발 환경에선 파일이 자주 변경되므로 매 요청마다 최신 템플릿을 읽어야 하는 반면 프로덕션 환경에선 파일이 변경되지 않으므로 미리 캐싱해 서버 성능을 향상시킨다.

#### 환경별 미들웨어 설정

```js
// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}
```

- 개발 환경에선 빠른 피드백과 HMR을 위해 Vite 개발 서버를 사용한다.
  - middlewareMode: true: Express 서버 내에서 Vite 개발 서버를 미들웨어로 실행
  - appType: "custom": Vite가 제공하는 기본 HTML 처리를 사용하지 않고 커스텀 설정 사용
  - app.use(vite.middlewares): Vite의 HMR, 소스 변환 등의 기능 활성화
- 프로덕션 환경에선 성능 최적화에 중점을 둔다.
  - compression: HTTP 응답을 압축하여 전송 속도 향상
  - sirv: 정적 파일 서빙을 위한 미들웨어, 빌드된 클라이언트 파일들을 제공
  - \{ extensions: \[\] \}: URL 확장자가 없을 때 자동으로 확장자를 추가하지 않도록 설정

#### HTML serving

```js
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }
```

- 개발 환경
  - 매 요청마다 최신 템플릿 파일을 읽어옴
  - Vite의 transformIndexHtml을 사용해 HTML 변환
  - Vite의 ssrLoadModule을 사용해 entry-server 모듈을 로드하고 최신 코드 반영
- 프로덕션 환경
  - 시작 시 미리 캐싱된 템플릿 사용
  - 빌드된 서버 측 번들에서 render 함수 import

#### 스트리밍 SSR 렌더링 처리

```js
    let didError = false;

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

        res.write(htmlStart);

        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });

        pipe(transformStream);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});
```

- entry-server에 있는 render 함수를 호출하여 React 컴포넌트를 Stream으로 렌더링한다.
- onShellError
  - 초기 셸을 렌더링할 때 오류가 발생하면 호출되는 콜백이다.
    > 앱의 `<Suspense>` 경계 밖에 있는 부분을 셸(shell)이라고 합니다.
- onShellReady
  - 초기 셸이 렌더링된 직후에 실행되는 콜백이다.
  - **스트리밍 처리**를 이곳에서 하게 된다.
    - HTML 템플릿을 자리 지정자를 기준으로 시작과 끝 부분으로 분할
    - 먼저 HTML 시작 부분을 클라이언트로 전송
      - 브라우저는 명시적으로 닫히지 않은 HTML 태그를 파싱 과정에서 자동으로 닫기 때문에 HTML 시작 부분을 먼저 보낼 수 있음.
    - Transform 스트림을 생성하여 렌더링된 React 컴포넌트를 클라이언트로 스트리밍한다.
    - 스트림 완료 후 HTML 끝 부분을 전송

## 실행

어떤 의존성을 가지고 무슨 구조로 어떻게 동작하는지 간단하게 알아봤으니 이제 실제로 실행을 해보자
package.json에 있는 script를 참고하여 빌드 및 실행하면 다음과 같은 화면을 마주할 수 있다.

![img-1](/post/react-ssr-with-vite-express/img-1.png)

SSR을 사용했기 때문에 내용이 채워져서 클라이언트에 전달된다.

## 참조

- React - [renderToPipeableStream](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream), [HydrateRoot](https://ko.react.dev/reference/react-dom/client/hydrateRoot)
- Vite - [SSR](https://ko.vite.dev/guide/ssr.html)

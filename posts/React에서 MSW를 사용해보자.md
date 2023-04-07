---
title: React에서 MSW를 사용해보자
description: MSW (Mock Service Worker)를 사용해서 생산성을 높여보아요
date: 2023-04-05 22:12:51
published: true
slug: react-use-msw
tags:
  - react
  - msw
---

현업에서 개발을 하다보면 `기획 - API 개발 - 프론트엔드 개발` 순서로 진행하게 된다.  
하지만? 현실은 저 순서가 이상적으로 진행되지 않는다. 백엔드 개발과 프론트엔드 개발이 동시에 이루어지게 되고 프론트엔드는 API에 의존하기 때문에 API가 완성되기까지의 대기하는 시간이 생길 수 밖에 없다.

프론트엔드 개발은 빠르고 많은 기획 변경과 테스트, 기능 개발까지 다양한 업무를 진행하며 완성도에 대한 압박과
스트레스를 받는다. 한정된 기간에 정해진 기능을 구현하려면 개발이 가능한 시간이 많을 수록 완성도가 높아지고 압박감이 조금 사라질 수 있다.

그래서 검색을 하던 중 MSW를 사용해서 Mocking을 하면 좋을 것 같아서 한번 사용해보려한다.

## MSW(Mock Service Worker)란?

[MSW](https://mswjs.io/)는 Service Worker를 사용하여 request를 가로채는 API 모킹 라이브러리다.

![msw.jpeg](/post/react-use-msw/msw.jpeg)

작동되는 원리는

1. 브라우저가 서비스 워커에 요청을 보내고
2. 서비스 워커가 요청을 복사한다.
3. 요청과 일치하는 응답을 생성하고
4. 모의 작성된 응답을 서비스 워커에 보낸다.
5. 브라우저는 모의로 작성된 응답을 제공받는다.

작동하는건 알겠고 그래서 이걸 사용하여 얻는 장점이 무엇일까?

### MSW를 사용하여 얻는 장점

실제 네트워크단에서 모킹이 이루어져서 프론트엔드 코드에선 그냥 API를 호출하는 것과 동일하게 작성할 수 있다.
추후 개발 완료된 실제 API로 빠르게 변경할 수 있다. 그리고 테스트에 용이하다고 한다.

Node 환경에서도 작동하기 때문에 Jest를 이용한 기능 테스트를 할 때 장점이 있다.

그럼 한번 사용을 해보자

## 프로젝트 세팅

pnpm과 vite를 사용해서 리액트 프로젝트를 세팅해보자 매우 간단하다.

```shell
pnpm create vite react-msw-todolist --template react-ts
cd react-msw-todolist
pnpm i
```

> 혹시나 pnpm이 설치가 되어있지 않은 경우 npm, yarn을 사용해도 된다.

그리고 MSW를 설치해보자

```shell
pnpm i -D msw
```

일단 프로젝트 세팅은 다 했다.

## MSW를 실행하기 위해 서비스 워커 설정

`npx msw init <PUBLIC_DIR> --save` 명령어를 사용하여 서비스 워커를 생성할 수 있다.

```shell
npx msw init public/ --save
```

## Mocks 정의, 요청 핸들러 작성

`src/mocks/handlers.ts`

```ts
import { rest } from "msw";
import { Todo } from "../types/todo";

const todoList: Todo[] = [
  {
    id: 1,
    content: "운동하기",
    isCompleted: true,
  },
  {
    id: 2,
    content: "여행 계획 세우기",
    isCompleted: false,
  },
];

export const handlers = [
  rest.get("/todo", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        todos: todoList,
      })
    );
  }),

  rest.post<Omit<Todo, "id">>("/todo", async (req, res, ctx) => {
    const body: Todo = await req.json();

    if (!body?.content) {
      return res(ctx.status(400));
    }

    todoList.push({
      ...body,
      id: todoList.length + 1,
    });

    return res(ctx.status(200));
  }),
];
```

> 참고로 sessionStorage, localStorage, indexedDB를 사용할 수 있다.

## 서비스 워커 생성

msw에서 제공하는 `setupWork`로 서비스 워커를 생성해준다.

`src/mocks/browser.ts`

```ts
import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

## 서비스 워커 실행

React 기준 `src/main.tsx`에 서비스 워커를 실행하는 코드를 추가해보자

CRA의 경우 아래처럼 하면 서비스 워커가 실행된다.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const isDev = process.env.NODE_ENV === "development";
if (isDev) {
  const { worker } = require("./mocks/browser");
  worker.start();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

그런데 필자의 경우 vite를 사용하기 때문에 조금 다른 방식을 사용해야 한다.  
그래서 아래와 같은 방식을 사용했다.
[참고 이슈](https://github.com/mswjs/msw/discussions/712)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const isDev = import.meta.env.DEV;

const prepare = async (): Promise<void> => {
  if (isDev) {
    const { worker } = await import("./mocks/browser");

    worker.start();
  }
};

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

실행하면 개발자 도구 콘솔에 아래와 같이 뜬다.
![img-1.png](/post/react-use-msw/img-1.png)

### +추가 Next.js에서 실행
`_app.ts`
```ts
const isDev = process.env.NODE_ENV === 'development';
if (isDev && isClient()) {
  const { worker } = require('../mocks/browser');
  worker.start();
}
```

## 작동 테스트

이제 작동하는지 한번 테스트 해보자  
fetch 함수를 이용해서 요청을 날려보자

```ts
fetch("/todo")
  .then((res) => res.json())
  .then((res) => console.log(res));
```

```txt
[MSW] 00:31:51 GET /todo (200 OK)
```

그럼 이렇게 개발자 도구 콘솔에 찍힌다.

**POST**도 요청해보자

```ts
const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  fetch("/todo", {
    method: "post",
    body: JSON.stringify(Object.fromEntries(formData.entries())),
  }).then(() => getTodoList());

  event.currentTarget.reset();
};
```

그리고 개발자 도구 콘솔을 확인하면?

```txt
[MSW] 01:02:26 POST /todo (200 OK)
```

이렇게 잘 동작하는걸 확인할 수 있다.

다음 글에서는 MSW를 이용하여 테스트 코드를 작성해보고 MSW의 다양한 이용 방법에 대해서 알아볼 것이다.

## 참고

- [MSW docs](https://mswjs.io/docs/)
- [MSW로 백앤드 API 모킹하기](https://www.daleseo.com/mock-service-worker/)
- [MSW(Mock Service Worker)로 더욱 생산적인 FE 개발하기](https://hayeondev.gatsbyjs.io/221104-msw/)

---
title: Storybook에서 MSW를 사용해보자
description: Storybook에서 MSW를 사용하여 모킹을 해봅시다.
date: 2023-07-06 11:12:51
published: true
slug: storybook-use-msw
tags:
  - react
  - msw
  - storybook
---

_[이전 글](/post/react-use-msw)에선 React에서 MSW를 사용하는 방법을 알아보았다._  
이번엔 Storybook에서 사용해보자

## 필요한 라이브러리 설치

1. [msw-storybook-addon](https://storybook.js.org/addons/msw-storybook-addon)을 설치해준다.

```shell
npm i -D msw-storybook-addon
```

## Storybook 설정 변경

`preview.js`

```js
import { initialize, mswDecorator } from "msw-storybook-addon";

// Initialize MSW
initialize();

addDecorator(mswDecorator);

/* ... */
```

## 사용해보자

```tsx
import { rest } from "msw";
import { ComponentMeta, Story } from "@storybook/react";
import { ComponentProps } from "react";
import TestComponent from "./TestComponent";

type Type = typeof TestComponent;
export default {
  title: "test/TestComponent",
  component: TestComponent,
} as ComponentMeta<Type>;

type Props = ComponentProps<typeof TestComponent>;

const Template: Story<Props> = (args) => <TestComponent {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.storyName = "TestComponent";

Default.parameters = {
  msw: {
    handlers: [
      rest.get(`/test/user`, (req, res, ctx) => {
        return res(ctx.json(userMockData));
      }),
    ],
  },
};
```

이렇게 하면 TestComponent에서 `/test/user`를 호출하면 userMockData에 있는 데이터가 나오게 된다. 너무 쉽죠?

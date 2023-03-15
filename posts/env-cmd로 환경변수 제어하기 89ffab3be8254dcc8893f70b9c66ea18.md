---
title: env-cmd로 환경변수 제어하기
description: 상황에 따른 환경 변수를 제어해보자
date: 2022-10-04 09:35:47
published: true
slug: environment-variable-control-by-env-cmd
tags:
  - env
---

# env-cmd로 환경변수 제어하기

개발 환경, 라이브 환경이 다른 환경변수를 사용하는 경우가 있다.
그런 경우에 `env-cmd`를 활용해서 환경변수를 설정할 수 있다.

---

## 💾 설치

```bash
npm i env-cmd
```

## 🗒 환경변수 파일 설정

- .env.production
- .env.development

2개의 env 파일을 만들어주고 그 안에 환경변수를 설정한다.

## ⌨️ 스크립트 작성

```json
// package.json
{
  ...
 "scripts": {
  "build:develop": "env-cmd -f .env.development next build",
    "build:production": "env-cmd -f .env.production next build",
  ...
 }
 ...
}
```

---
title: 로컬에서 nextjs ssl 환경 세팅
description: 로컬 환경에서 next.js를 SSL로 실행해보자
date: 2023-02-15 16:00:00
published: true
slug: nextjs-local-ssl
tags:
  - Next.js
  - SSL
---

## 로컬에서 nextjs ssl 환경 세팅

1. [mkcert](https://github.com/FiloSottile/mkcert) 설치

```sh
brew install mkcert
mkcert --install
```

1. localhost에 대한 key, cert 생성

```bash
mkcert localhost
```

1. nextjs 프로젝트에 적용

custom server를 만들어서 적용해야 함

[https://nextjs.org/docs/advanced-features/custom-server](https://nextjs.org/docs/advanced-features/custom-server)

- server.js 작성

```jsx
const http = require("http");
const https = require("https");
const fs = require("fs");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const PORT = 3005;
const app = next({ dev, hostname: "localhost", port: PORT });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });

  const options = {
    key: fs.readFileSync("./localhost-key.pem"),
    cert: fs.readFileSync("./localhost.pem"),
  };

  https
    .createServer(options, function (req, res) {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(PORT + 1, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${PORT + 1}`);
    });
});
```

1. 인증서(mkcert) 생성 자동화

init-https.sh 작성

```bash
#!/bin/bash

MKCERT_INSTALLED=$(which mkcert)

if [ -z $MKCERT_INSTALLED ];then
    brew install mkcert
fi

mkcert -install
mkcert localhost
```

1. package.json script 추가

```json
"scripts": {
		// ...
    "ssl-dev": "export PORT=3005 && node server.js",
    "init-https": "sh init-https.sh"
  },
```

1. 실행

```json
npm run init-https
npm run ssl-dev
```

1. 접속

https://localhost:{PORT}

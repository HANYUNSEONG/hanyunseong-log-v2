---
title: Docker - no matching manifest for linux/arm64/v8 in the manifest list entries 오류
description: Docker 오류 처리 기록
date: 2022-10-11 13:32:21
published: true
slug: docker-no-matching-manifest-for-linux-arm64-error
tags:
  - Docker
---

# Docker - no matching manifest for linux/arm64/v8 in the manifest list entries 오류

## 오류 내용

- mac m1을 사용하고 있고 Sentry 이미지를 받으려고 했는데 오류가 발생했다.

```bash
> sentry docker pull sentry
Using default tag: latest

latest: Pulling from library/sentry
**no matching manifest for linux/arm64/v8 in the manifest list entries**
```

## 해결

`pull` 할 때 `--platform linux/amd64`를 뒤에 덧붙인다.

```bash
docker pull sentry --platform linux/amd64
```

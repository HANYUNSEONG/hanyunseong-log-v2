<div align="center">
  <img src="./assets/logo.png" width="200px" />
</div>

# hanyunseong-log

MDX로 글을 쓰는 Next.js 정적 블로그입니다.

## Features

📝 Posts

- `posts/<slug>.mdx` 파일 하나가 글 하나입니다. 커밋하면 곧 배포입니다.
- Shiki를 이용한 빌드 타임 코드 하이라이팅 (라이트/다크 테마)
- 글 목차(TOC), 태그별 글 목록
- Giscus를 이용한 댓글 기능

🌗 Theme

- 시스템 설정을 따르는 라이트/다크 모드

🔎 SEO

- sitemap, robots.txt, RSS 자동 생성
- 글마다 Open Graph 이미지 자동 생성
- JSON-LD(BlogPosting) 구조화 데이터

😀 Information

- `src/config/site.ts`에서 블로그 정보와 댓글 설정을 변경

## 글 작성

`posts/<slug>.mdx` 파일을 만듭니다. 파일 이름이 곧 URL(`/post/<slug>`)입니다.

```md
---
title: 구글에서 도메인을 구입해보자
description: Google domain으로 내 도메인 구입하기
date: 2023-03-27 22:16:48
tags:
  - google-domain
---
```

| 필드        | 필수 | 설명                                          |
| ----------- | ---- | --------------------------------------------- |
| title       | O    | 글 제목                                       |
| description | O    | 목록과 SEO에 쓰이는 요약                      |
| date        | O    | `YYYY-MM-DD HH:mm:ss`, 한국 시간으로 해석     |
| tags        |      | 태그 목록                                     |
| published   |      | `false`면 게시하지 않습니다. 기본값은 `true`  |

front matter 형식이 잘못되면 빌드가 실패합니다.

이미지와 영상은 `public/post/<slug>/`에 두고 `/post/<slug>/파일명`으로 참조합니다.

## 🚀 Getting Started

1. 이 레포에 star를 주세요 😄
2. 이 레포를 [Fork](https://github.com/hanyunseong/hanyunseong-log-v2/fork)합니다.
3. `src/config/site.ts`를 본인의 정보에 맞게 수정합니다. 댓글은 [giscus.app](https://giscus.app/ko)에서 저장소 정보를 확인할 수 있습니다.

```bash
pnpm install
pnpm dev
```

Node.js 20.9 이상이 필요합니다.

## Environment Variable

- NEXT_PUBLIC_GOOGLE_ANALYTICS: Google analytics id

## Bug reporting

[Issues](https://github.com/hanyunseong/hanyunseong-log-v2/issues)

## LICENSE

[MIT](./LICENSE)

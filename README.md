<div align="center">
  <img src="./assets/logo.png" width="200px" />
  <div>
    <a href="./README.ko.md">[한국어]</a>
  </div>
</div>

# hanyunseong-log

Next.js static blog written in MDX.

## Features

📝 Posts

- One `posts/<slug>.mdx` file is one post. Commit it and it's published.
- Build-time syntax highlighting with Shiki (light/dark themes)
- Table of contents and per-tag post lists
- Comments powered by Giscus

🌗 Theme

- Light/dark mode that follows the system setting

🔎 SEO

- Generates sitemap, robots.txt and RSS feed
- Generates an Open Graph image for every post
- JSON-LD (BlogPosting) structured data

😀 Information

- Customize blog information and comments at `src/config/site.ts`.

## Writing a post

Create `posts/<slug>.mdx`. The file name becomes the URL (`/post/<slug>`).

```md
---
title: 구글에서 도메인을 구입해보자
description: Google domain으로 내 도메인 구입하기
date: 2023-03-27 22:16:48
tags:
  - google-domain
---
```

| Field       | Required | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| title       | O        | Post title                                        |
| description | O        | Summary used in lists and SEO                     |
| date        | O        | `YYYY-MM-DD HH:mm:ss`, interpreted as KST         |
| tags        |          | List of tags                                      |
| published   |          | Set to `false` to hide the post. Default `true`   |

The build fails if the front matter is invalid.

Put images and videos in `public/post/<slug>/` and reference them as `/post/<slug>/<file>`.

The web font (Pretendard) is subset to the characters used in posts and UI on every `pnpm dev`/`pnpm build`. Characters added while `pnpm dev` is running render in the fallback font until you restart it.

## 🚀 Getting Started

1. Star this repo 😄
2. [Fork](https://github.com/hanyunseong/hanyunseong-log-v2/fork) this repo.
3. Modify `src/config/site.ts` to your information. Get the comment settings from [giscus.app](https://giscus.app).

```bash
pnpm install
pnpm dev
```

Requires Node.js 24.

## Environment variable

- NEXT_PUBLIC_GOOGLE_ANALYTICS: Google analytics id

## Bug reporting

[Issues](https://github.com/hanyunseong/hanyunseong-log-v2/issues)

## LICENSE

[MIT](./LICENSE)

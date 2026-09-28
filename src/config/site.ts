export const siteConfig = {
  title: "hanyunseong-log",
  description: "hanyunseong-log",
  locale: "ko_KR",
  url: "https://hanyunseong-log.dev",
  author: {
    name: "HANYUNSEONG",
    email: "hanyunseong.dev@gmail.com",
    github: "https://github.com/HANYUNSEONG",
  },
  repository: "https://github.com/HANYUNSEONG/hanyunseong-log-v2",
  // https://giscus.app 에서 저장소를 입력하면 확인할 수 있습니다.
  giscus: {
    repo: "HANYUNSEONG/hanyunseong-log-v2-comments",
    repoId: "R_kgDOJSHp7g",
    category: "Announcements",
    categoryId: "DIC_kwDOJSHp7s4DGjIR",
  },
} as const;

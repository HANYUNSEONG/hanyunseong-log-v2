export const blogConfig = {
  title: "hanyunseong-log",
  locale: "ko",
  url: "https://hanyunseong-log.dev",
  author: {
    name: "HANYUNSEONG",
  },
};

export const defaultSEO = {
  title: blogConfig.title,
  openGraph: {
    type: "website",
    locale: "ko-KR",
    url: blogConfig.url,
    siteName: blogConfig.title,
  },
};

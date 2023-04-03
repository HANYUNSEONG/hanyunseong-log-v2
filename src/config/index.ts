import { DefaultSeoProps } from "next-seo";

export const blogConfig = {
  title: "hanyunseong-log",
  description: "hanyunseong-log",
  locale: "ko",
  url: "https://hanyunseong-log.dev",
  author: {
    name: "HANYUNSEONG",
  },
  contacts: {
    email: "hanyunseong.dev@gmail.com",
    github: "https://github.com/HANYUNSEONG",
  },
  projectUrl: "https://github.com/HANYUNSEONG/hanyunseong-log-v2",
};

export const defaultSEO: DefaultSeoProps = {
  title: blogConfig.title,
  description: blogConfig.description,
  openGraph: {
    type: "website",
    locale: "ko-KR",
    url: blogConfig.url,
    siteName: blogConfig.title,
    images: [
      {
        url: "/images/favicon.png",
        width: 250,
        height: 250,
        alt: "hanyunseong-log Logo",
        type: "image/png",
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/images/favicon.png",
    },
    {
      rel: "apple-touch-icon",
      href: "/images/favicon.png",
      sizes: "76x76",
    },
  ],
};

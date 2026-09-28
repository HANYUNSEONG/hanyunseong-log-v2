import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts, getAllTags } from "@/lib/posts";

// URL 생성자를 거쳐 한글 경로를 퍼센트 인코딩한다.
const toUrl = (pathname: string) => new URL(pathname, siteConfig.url).href;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    { url: toUrl("/"), lastModified: posts[0]?.date },
    { url: toUrl("/tags") },
    ...getAllTags().map(({ slug }) => ({ url: toUrl(`/tags/${slug}`) })),
    ...posts.map(({ slug, date }) => ({
      url: toUrl(`/post/${slug}`),
      lastModified: date,
    })),
  ];
}

import RSS from "rss";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const feed = new RSS({
    title: siteConfig.title,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    image_url: `${siteConfig.url}/images/favicon.png`,
    language: "ko",
    pubDate: posts[0]?.date,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author.name}`,
  });

  for (const { slug, title, description, date, tags } of posts) {
    feed.item({
      title,
      description,
      url: `${siteConfig.url}/post/${slug}`,
      date,
      categories: tags.map((tag) => tag.name),
      author: siteConfig.author.name,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

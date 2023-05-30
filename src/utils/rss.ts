import { blogConfig } from "../config";
import RSS from "rss";
import fs from "fs";
import { getAllPosts } from "./post";

export default async function generateRssFeed() {
  const site_url = "hanyunseong-log.dev";

  const posts = await getAllPosts();

  const feedOptions = {
    title: blogConfig.title,
    description: blogConfig.description,
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/images/favicon.png`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, hanyunseong`,
  };

  const feed = new RSS(feedOptions);
  posts.map((post) => {
    const { frontMatter } = post;

    feed.item({
      title: frontMatter.title,
      description: frontMatter.description,
      url: `${site_url}/blog/${frontMatter.slug}`,
      date: frontMatter.date,
    });
  });

  fs.writeFileSync("public/rss.xml", feed.xml({ indent: true }));
}

generateRssFeed();

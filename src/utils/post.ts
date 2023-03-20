import fs from "fs";

import { sync } from "glob";
import frontMatter from "front-matter";
import { FrontMatter, Post } from "@/types/post";

const POST_PATH = `${process.cwd()}/posts`;

export async function getAllPosts(): Promise<Post[]> {
  const files = sync(`${POST_PATH}/**/*.md`);

  const posts = files
    .reduce<Post[]>((prev, path) => {
      const file = fs.readFileSync(path, { encoding: "utf8" });
      const { attributes, body } = frontMatter<FrontMatter>(file);

      if (!attributes) return prev;

      const { published } = attributes;

      if (!published) return prev;

      const post: Post = {
        frontMatter: attributes,
        body,
        path,
      };

      return prev.concat(post);
    }, [])
    .sort((a, b) =>
      new Date(a.frontMatter.date).getTime() <
      new Date(b.frontMatter.date).getTime()
        ? 1
        : -1
    );

  return posts;
}

import fs from "fs";

import { sync } from "glob";
import frontMatter from "front-matter";

const POST_PATH = `${process.cwd()}/posts`;

export async function getAllPosts() {
  const files = sync(`${POST_PATH}/**/*.md`);

  const posts = files.reduce<any[]>((prev, path) => {
    const file = fs.readFileSync(path, { encoding: "utf8" });
    const { attributes, body } = frontMatter(file);

    return [];
  }, []);

  return posts;
}

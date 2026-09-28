import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "posts");
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
// front matter의 date는 타임존 없이 작성하므로 한국 시간으로 해석한다.
const LOCAL_DATE = /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?$/;

const frontMatterSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z
    .string()
    .regex(LOCAL_DATE, "YYYY-MM-DD HH:mm:ss 형식이어야 합니다.")
    .transform((value) => {
      const [, day, time = "00:00"] = value.match(LOCAL_DATE)!;
      return new Date(`${day}T${time}+09:00`);
    }),
  published: z.boolean().default(true),
  tags: z.array(z.string().min(1)).default([]),
});

export type Tag = {
  name: string;
  slug: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: Tag[];
};

export type Post = PostMeta & {
  body: string;
};

export type TagWithCount = Tag & {
  count: number;
};

export function toTagSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function readPost(fileName: string) {
  const source = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const match = source.match(FRONT_MATTER);

  if (!match) {
    throw new Error(`posts/${fileName}: front matter가 없습니다.`);
  }

  const result = frontMatterSchema.safeParse(parse(match[1]));

  if (!result.success) {
    throw new Error(`posts/${fileName}\n${z.prettifyError(result.error)}`);
  }

  const { published, tags, ...frontMatter } = result.data;
  const post: Post = {
    slug: fileName.replace(/\.mdx$/, ""),
    ...frontMatter,
    tags: tags.map((name) => ({ name, slug: toTagSlug(name) })),
    body: source.slice(match[0].length),
  };

  return { post, published };
}

export const getAllPosts = cache((): Post[] =>
  fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(readPost)
    .filter(({ published }) => published)
    .map(({ post }) => post)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
);

export function getPost(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllTags(): TagWithCount[] {
  const tags = new Map<string, TagWithCount>();

  for (const tag of getAllPosts().flatMap((post) => post.tags)) {
    const saved = tags.get(tag.slug);
    tags.set(tag.slug, { ...tag, count: (saved?.count ?? 0) + 1 });
  }

  return [...tags.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
}

export function getPostsByTag(tagSlug: string) {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tag.slug === tagSlug)
  );
}

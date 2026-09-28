import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type Props = {
  params: Promise<{ tag: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

async function findTag(params: Props["params"]) {
  // 한글 태그는 인코딩된 채로 들어올 수 있다.
  const slug = decodeURIComponent((await params).tag);

  return getAllTags().find((tag) => tag.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await findTag(params);

  if (!tag) return {};

  return {
    title: `#${tag.name}`,
    description: `${tag.name} 태그가 달린 글 ${tag.count}개`,
  };
}

const TagPage = async ({ params }: Props) => {
  const tag = await findTag(params);

  if (!tag) notFound();

  const posts = getPostsByTag(tag.slug);

  return (
    <>
      <div className="pt-6 pb-10">
        <Link
          href="/tags"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← 모든 태그
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          #{tag.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{posts.length}개의 글</p>
      </div>
      <div className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <PostList posts={posts} />
      </div>
    </>
  );
};

export default TagPage;

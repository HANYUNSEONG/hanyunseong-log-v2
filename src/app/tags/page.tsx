import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "태그",
};

const TagsPage = () => {
  const tags = getAllTags();

  return (
    <>
      <div className="pt-6 pb-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          태그
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{tags.length}개의 태그</p>
      </div>
      <ul className="flex flex-wrap gap-2 border-t border-zinc-200 pt-10 dark:border-zinc-800">
        {tags.map(({ name, slug, count }) => (
          <li key={slug}>
            <Link
              href={`/tags/${slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
            >
              {name}
              <span className="text-xs text-zinc-400 tabular-nums">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TagsPage;

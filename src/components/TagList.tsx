import Link from "next/link";
import type { Tag } from "@/lib/posts";

type Props = {
  tags: Tag[];
};

const TagList = ({ tags }: Props) => {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={`/tags/${tag.slug}`}
            className="relative z-10 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TagList;

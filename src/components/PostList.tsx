import Link from "next/link";
import { formatDate } from "@/lib/date";
import type { PostMeta } from "@/lib/posts";
import TagList from "./TagList";

type Props = {
  posts: PostMeta[];
};

const PostList = ({ posts }: Props) => {
  return (
    <ul className="flex flex-col gap-10">
      {posts.map(({ slug, title, description, date, tags }) => (
        <li key={slug}>
          <article className="group relative">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
              {/* 카드 전체를 클릭할 수 있도록 링크 영역을 article 크기로 늘린다. */}
              <Link href={`/post/${slug}`} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h3>
            <p className="mt-1.5 line-clamp-2 text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <time
                dateTime={date.toISOString()}
                className="text-sm text-zinc-500 tabular-nums"
              >
                {formatDate(date)}
              </time>
              <TagList tags={tags} />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default PostList;

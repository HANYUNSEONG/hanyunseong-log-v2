import PostList from "@/components/PostList";
import { getYear } from "@/lib/date";
import { getAllPosts } from "@/lib/posts";

const HomePage = () => {
  const posts = getAllPosts();
  const postsByYear = Map.groupBy(posts, (post) => getYear(post.date));

  return (
    <>
      <div className="pt-6 pb-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          전체 글
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{posts.length}개의 글</p>
      </div>
      {[...postsByYear].map(([year, posts]) => (
        <section
          key={year}
          className="border-t border-zinc-200 py-10 sm:grid sm:grid-cols-[5rem_1fr] dark:border-zinc-800"
        >
          <h2 className="mb-6 text-sm font-medium text-zinc-400 tabular-nums sm:mb-0 sm:pt-1">
            {year}
          </h2>
          <PostList posts={posts} />
        </section>
      ))}
    </>
  );
};

export default HomePage;

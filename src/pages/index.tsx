import PostItem from "@/components/posts/PostItem";
import { Post } from "@/types/post";
import { getAllPosts } from "@/utils/post";
import { useRouter } from "next/router";

type Props = {
  posts: Post[];
};

const Home = ({ posts }: Props) => {
  const router = useRouter();

  return (
    <article className="py-8">
      <div>
        <h1 className="text-lg border-b border-gray-200 py-4">전체 글</h1>
      </div>
      <ul className="mt-5 flex flex-col gap-y-4">
        {posts?.map((post) => (
          <li
            className="bg-white p-5 rounded-lg shadow-sm cursor-pointer transition hover:-translate-y-1 hover:shadow-md"
            key={post.frontMatter.slug}
            onClick={() => {
              router.push(`/post/${post.frontMatter.slug}`);
            }}
          >
            <PostItem {...post} />
          </li>
        ))}
      </ul>
    </article>
  );
};

export async function getStaticProps() {
  const posts = await getAllPosts();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
}

export default Home;

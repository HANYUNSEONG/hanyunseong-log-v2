import PostItem from "@/components/posts/PostItem";
import { getAllPosts } from "@/utils/post";

const Home = () => {
  return (
    <article className="py-8">
      <div>
        <h1 className="text-lg border-b border-gray-200 py-4">전체 글</h1>
      </div>
      <ul className="mt-5 flex flex-col gap-y-4">
        <li className="bg-white p-5 rounded-lg shadow-sm">
          <PostItem />
        </li>
        <li className="bg-white p-5 rounded-lg shadow-sm">
          <PostItem />
        </li>
      </ul>
    </article>
  );
};

export async function getStaticProps() {
  const posts = await getAllPosts();

  return {
    props: {},
  };
}

export default Home;

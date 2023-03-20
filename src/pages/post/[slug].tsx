import { Post } from "@/types/post";
import { getAllPosts } from "@/utils/post";
import { GetStaticPropsContext } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

type Props = {
  post: Post;
  mdx: MDXRemoteSerializeResult;
};

const PostPage = ({ post, mdx }: Props) => {
  return (
    <div>
      <MDXRemote {...mdx}></MDXRemote>
    </div>
  );
};

// https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map((post) => ({
    params: {
      slug: post.frontMatter.slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { slug } = params as { slug: string };
  const posts = await getAllPosts();
  const post = posts.find(({ frontMatter }) => frontMatter.slug === slug);

  if (!post) {
    return {
      props: {},
    };
  }

  const mdxSource = await serialize(post.body);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      mdx: mdxSource,
    },
  };
}

export default PostPage;

import { Post } from "@/types/post";
import { getAllPosts } from "@/utils/post";
import { GetStaticPropsContext } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import toc from "remark-toc";
import prism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkMath from "remark-math";
import remarkSlug from "remark-slug";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import dayjs from "dayjs";
import { ArticleJsonLd, NextSeo } from "next-seo";
import { blogConfig } from "@/config";
import rehypeHighlight from "rehype-highlight";

type Props = {
  post: Post;
  mdx: MDXRemoteSerializeResult;
};

const PostPage = ({ post, mdx }: Props) => {
  const {
    frontMatter: { title, description, date, tags, slug },
  } = post;
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title: title,
          description: title,
          type: "article",
          article: {
            publishedTime: dayjs(date).toISOString(),
            authors: [blogConfig.url],
            tags,
          },
        }}
      />
      <ArticleJsonLd
        url={`${blogConfig}/${slug}`}
        title={title}
        description={description}
        openGraph={{
          title: title,
          description: title,
          type: "article",
          article: {
            publishedTime: dayjs(date).toISOString(),
            authors: [blogConfig.url],
            tags,
          },
        }}
        images={[]}
        datePublished={dayjs(date).toISOString()}
        authorName={blogConfig.author.name}
      />

      <article className="px-4 lg:px-9 bg-white shadow-lg divide-y">
        <header className="flex flex-col justify-center items-center gap-y-2 py-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">
            {dayjs(date).format("YYYY.MM.DD")}
          </p>
        </header>

        <div className="prose max-w-none py-8">
          <MDXRemote {...mdx}></MDXRemote>
        </div>
      </article>
    </>
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

  const mdxSource = await serialize(post.body, {
    mdxOptions: {
      remarkPlugins: [remarkMath, toc, remarkSlug, remarkGfm],
      rehypePlugins: [
        rehypeKatex,
        prism,
        rehypeAutolinkHeadings,
        rehypeSlug,
        rehypeHighlight,
      ],
    },
  });

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      mdx: mdxSource,
    },
  };
}

export default PostPage;

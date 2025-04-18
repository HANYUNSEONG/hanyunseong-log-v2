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
import "highlight.js/styles/night-owl.css";
import langDockerfile from "highlight.js/lib/languages/dockerfile";
import Link from "next/link";
import dynamic from "next/dynamic";
const UtterancesComments = dynamic(
  () => import("@/components/UtterancesComments"),
  {
    ssr: false,
  }
);

type Props = {
  post: Post;
  mdx: MDXRemoteSerializeResult;
};

const PostPage = ({ post, mdx }: Props) => {
  const {
    frontMatter: { title, description, date, tags, slug },
  } = post;
  const {
    title: blogTitle,
    contacts: { email },
    projectUrl,
  } = blogConfig;

  const seoTitle = `${title} - ${blogTitle}`;

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={description}
        openGraph={{
          title: seoTitle,
          description: description,
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
          description: description,
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

        <div className="py-4">
          <UtterancesComments />
        </div>

        <footer className="py-5">
          <p className="text-[10px] md:text-xs">
            잘못된 내용이 있는 경우{" "}
            <Link
              href={`${projectUrl}/issues`}
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github issues
            </Link>{" "}
            혹은{" "}
            <Link href={`mailto:${email}`} className="text-blue-500">
              이메일
            </Link>
            로 피드백 부탁드립니다!
          </p>
        </footer>
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

const languages = {
  dockerfile: langDockerfile,
};
const aliases = {
  docker: "dockerfile",
};

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
        () => {
          return rehypeHighlight({
            languages,
            aliases,
          });
        },
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

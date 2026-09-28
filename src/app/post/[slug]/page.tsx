import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import TableOfContents from "@/components/TableOfContents";
import TagList from "@/components/TagList";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/date";
import { renderPost } from "@/lib/mdx";
import { getAllPosts, getPost } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      siteName: siteConfig.title,
      title: post.title,
      description: post.description,
      url: `/post/${post.slug}`,
      publishedTime: post.date.toISOString(),
      authors: [siteConfig.url],
      tags: post.tags.map((tag) => tag.name),
    },
  };
}

const PostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const { title, description, date, tags } = post;
  const { Content, toc } = await renderPost(post.body);
  const url = `${siteConfig.url}/post/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    image: `${url}/opengraph-image`,
    datePublished: date.toISOString(),
    keywords: tags.map((tag) => tag.name),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.github,
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="border-b border-zinc-200 pt-6 pb-10 dark:border-zinc-800">
        <TagList tags={tags} />
        <h1 className="mt-5 text-3xl leading-tight font-bold tracking-tight break-keep text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-4 text-zinc-500">{description}</p>
        <time
          dateTime={date.toISOString()}
          className="mt-6 block text-sm text-zinc-500 tabular-nums"
        >
          {formatDate(date)}
        </time>
      </header>

      <div className="relative">
        {toc.length > 0 && <TableOfContents items={toc} />}
        <div className="prose prose-zinc dark:prose-invert prose-blog max-w-none py-10 break-keep wrap-break-word">
          <Content />
        </div>
      </div>

      <footer className="border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800">
        잘못된 내용이 있다면{" "}
        <a
          href={`${siteConfig.repository}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          GitHub Issues
        </a>{" "}
        또는{" "}
        <a
          href={`mailto:${siteConfig.author.email}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          이메일
        </a>
        로 알려주세요.
      </footer>

      <Comments />
    </article>
  );
};

export default PostPage;

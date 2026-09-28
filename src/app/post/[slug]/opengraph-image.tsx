import { siteConfig } from "@/config/site";
import { ogImageSize, renderOgImage } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export const alt = siteConfig.title;
export const size = ogImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

const Image = async ({ params }: Props) => {
  const post = getPost((await params).slug);

  return renderOgImage({
    title: post?.title ?? siteConfig.title,
    description: post?.description,
  });
};

export default Image;

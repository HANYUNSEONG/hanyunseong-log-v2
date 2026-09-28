import { siteConfig } from "@/config/site";
import { ogImageSize, renderOgImage } from "@/lib/og";

export const alt = siteConfig.title;
export const size = ogImageSize;
export const contentType = "image/png";

const Image = () => {
  return renderOgImage({ title: siteConfig.title });
};

export default Image;

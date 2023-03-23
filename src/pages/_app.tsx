import type { AppProps } from "next/app";
import "@/styles/globalStyle.css";
import BlogLayout from "@/components/BlogLayout";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "@/config";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BlogLayout>
      <DefaultSeo {...defaultSEO} />
      <Component {...pageProps} />
    </BlogLayout>
  );
}

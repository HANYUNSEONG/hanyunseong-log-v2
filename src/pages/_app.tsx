import type { AppProps } from "next/app";
import "@/styles/globalStyle.css";
import BlogLayout from "@/components/BlogLayout";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "@/config";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      <BlogLayout>
        <Component {...pageProps} />
      </BlogLayout>
      <Analytics />
    </>
  );
}

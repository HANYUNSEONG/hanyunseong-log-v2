import type { AppProps } from "next/app";
import "@/styles/globalStyle.css";
import BlogLayout from "@/components/BlogLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BlogLayout>
      <Component {...pageProps} />
    </BlogLayout>
  );
}

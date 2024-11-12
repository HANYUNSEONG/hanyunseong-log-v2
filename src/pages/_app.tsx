import type { AppProps } from "next/app";
import "@/styles/globalStyle.css";
import BlogLayout from "@/components/BlogLayout";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "@/config";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <Script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
            `,
            }}
          />
        </>
      )}
      <BlogLayout>
        <Component {...pageProps} />
      </BlogLayout>
      <Analytics />
    </>
  );
}

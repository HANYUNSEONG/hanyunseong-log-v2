import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { siteConfig } from "@/config/site";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.github }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.title,
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 sm:px-8">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
};

export default RootLayout;

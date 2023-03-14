import type { AppProps } from "next/app";
import "@/styles/globalStyle.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

import { blogConfig } from "@/config";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const BlogLayout = ({ children }: Props) => {
  const {
    title,
    contacts: { github },
  } = blogConfig;

  return (
    <div className="container mx-auto lg:px-4 max-w-full lg:max-w-3xl overflow-hidden">
      <header className="py-7 flex flex-col gap-y-2 items-center">
        <Link href="/">
          <h1 className="font-bold text-2xl italic underline text-center">
            {title}
          </h1>
        </Link>
      </header>
      <main>{children}</main>
      <footer className="flex justify-center items-center gap-x-2 py-8">
        <p className="text-sm">© 2023 hanyunseong</p>
        <div className="w-0.5 h-0.5 rounded-full bg-slate-700" />
        <Link
          className="text-sm"
          href={github}
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </Link>
      </footer>
    </div>
  );
};

export default BlogLayout;

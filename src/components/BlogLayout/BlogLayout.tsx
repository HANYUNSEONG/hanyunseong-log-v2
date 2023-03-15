import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const BlogLayout = ({ children }: Props) => {
  return (
    <div className="container mx-auto max-w-3xl px-4">
      <header className="py-7">
        <Link href="/">
          <h1 className="font-bold text-2xl italic underline text-center">
            hanyunseong-log
          </h1>
        </Link>
      </header>
      <main>{children}</main>
      <footer className="flex justify-center items-center gap-x-2 py-8">
        <p>© 2023 hanyunseong</p>
        <div className="w-0.5 h-0.5 rounded-full bg-slate-700" />
        <Link href="http://github.com/hanyunseong" target="_blank">
          Github
        </Link>
      </footer>
    </div>
  );
};

export default BlogLayout;

import Link from "next/link";
import { siteConfig } from "@/config/site";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "글" },
  { href: "/tags", label: "태그" },
];

const SiteHeader = () => {
  return (
    <header className="flex items-center justify-between py-8">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        {siteConfig.title}
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-md px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default SiteHeader;

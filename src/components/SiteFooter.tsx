import { siteConfig } from "@/config/site";

const SiteFooter = () => {
  return (
    <footer className="mt-24 flex flex-col gap-3 border-t border-zinc-200 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
      <p>
        © {new Date().getFullYear()} {siteConfig.author.name}
      </p>
      <ul className="flex gap-4">
        <li>
          <a
            href={siteConfig.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href="/rss.xml"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            RSS
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default SiteFooter;

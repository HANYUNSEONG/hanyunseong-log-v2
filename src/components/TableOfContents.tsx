"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/mdx";

// 이 위치보다 위로 지나간 마지막 헤딩을 현재 읽는 섹션으로 본다.
const ACTIVE_OFFSET = 120;

type Props = {
  items: TocItem[];
};

const TocLinks = ({ items, activeId }: Props & { activeId?: string }) => {
  return (
    <ol className="flex flex-col gap-2 text-sm">
      {items.map(({ id, text, depth }) => (
        <li key={id} className={depth === 3 ? "pl-3" : undefined}>
          <a
            href={`#${id}`}
            className={`block leading-snug transition-colors ${
              id === activeId
                ? "font-medium text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
};

const TableOfContents = ({ items }: Props) => {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((heading) => heading !== null);

    const updateActiveId = () => {
      let current: string | undefined;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > ACTIVE_OFFSET) break;
        current = heading.id;
      }

      setActiveId(current);
    };

    updateActiveId();
    window.addEventListener("scroll", updateActiveId, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveId);
  }, [items]);

  return (
    <>
      <details className="mt-8 rounded-lg border border-zinc-200 px-4 py-3 xl:hidden dark:border-zinc-800">
        <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
          목차
        </summary>
        <div className="mt-3">
          <TocLinks items={items} />
        </div>
      </details>
      <aside className="absolute top-0 left-full ml-10 hidden h-full w-52 xl:block">
        <nav aria-label="목차" className="sticky top-10 pt-10">
          <p className="mb-3 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            목차
          </p>
          <TocLinks items={items} activeId={activeId} />
        </nav>
      </aside>
    </>
  );
};

export default TableOfContents;

import fs from "node:fs";
import path from "node:path";
import { evaluate } from "@mdx-js/mdx";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Element, Root } from "hast";
import { toString } from "hast-util-to-string";
import { imageSize } from "image-size";
import * as runtime from "react/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { createHighlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { visit } from "unist-util-visit";

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

const highlighter = createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: [
    "typescript",
    "tsx",
    "javascript",
    "jsx",
    "json",
    "html",
    "shellscript",
    "dockerfile",
  ],
  engine: createJavaScriptRegexEngine(),
});

function isHeading(node: Element): node is Element & { tagName: "h2" | "h3" } {
  return node.tagName === "h2" || node.tagName === "h3";
}

// rehype-slug가 붙인 id를 그대로 목차에 사용한다.
function rehypeCollectHeadings(toc: TocItem[]) {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const { id } = node.properties;

      if (isHeading(node) && typeof id === "string") {
        toc.push({
          id,
          text: toString(node),
          depth: node.tagName === "h2" ? 2 : 3,
        });
      }
    });
  };
}

// public 폴더의 이미지 크기를 읽어 레이아웃이 밀리지 않도록 한다.
function rehypeLocalImages() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const { src } = node.properties;

      if (node.tagName !== "img" || typeof src !== "string") return;
      if (!src.startsWith("/")) return;

      const file = fs.readFileSync(path.join(process.cwd(), "public", src));
      const { width, height } = imageSize(file);

      Object.assign(node.properties, {
        width,
        height,
        loading: "lazy",
        decoding: "async",
      });
    });
  };
}

export async function renderPost(source: string) {
  const toc: TocItem[] = [];
  const shiki = await highlighter;

  const { default: Content } = await evaluate(source, {
    ...runtime,
    format: "mdx",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeCollectHeadings, toc],
      rehypeLocalImages,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaHidden: true,
            tabIndex: -1,
          },
          content: { type: "text", value: "#" },
        },
      ],
      () =>
        rehypeShikiFromHighlighter(shiki, {
          themes: { light: "github-light", dark: "github-dark" },
          defaultLanguage: "text",
          fallbackLanguage: "text",
        }),
    ],
  });

  return { Content, toc };
}

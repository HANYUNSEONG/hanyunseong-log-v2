"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/config/site";

const Comments = () => {
  const { resolvedTheme } = useTheme();
  const { repo, repoId, category, categoryId } = siteConfig.giscus;

  if (!categoryId) return null;

  return (
    <Giscus
      repo={repo}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      // utterances와 같은 방식(pathname)으로 매핑해서 옮겨온 댓글을 그대로 찾는다.
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      lang="ko"
      loading="lazy"
    />
  );
};

export default Comments;

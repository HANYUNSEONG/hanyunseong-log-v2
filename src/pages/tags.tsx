import PostItem from "@/components/posts/PostItem";
import { Post, TagWithCount } from "@/types/post";
import { getAllPosts, getAllTags } from "@/utils/post";
import { useState } from "react";

type Props = {
  posts: Post[];
  tags: TagWithCount;
};

const TagsPage = ({ posts, tags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tagMap = Object.entries(tags);

  const onSelectTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : prev.concat(tag)
    );
  };

  const filterPosts = posts.filter(({ frontMatter: { tags } }) =>
    selectedTags.some((x) => tags.includes(x))
  );

  return (
    <div className="py-6">
      <ul className="flex flex-wrap gap-3">
        {tagMap.length < 1 && (
          <div>
            <p className="text-center italic">태그가 없네용</p>
          </div>
        )}
        {tagMap.map(([tag, count]) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <li
              key={tag}
              className={`bg-white rounded px-2 py-1 shadow-[0_5px_0px_0_#6b7280] border border-gray-500 transition cursor-pointer ${
                isSelected
                  ? "skew-y-2 shadow-[-2.5px_2.5px_0px_0_#6b7280]"
                  : "hover:shadow-[0_1px_0px_0_#6b7280] hover:translate-y-1"
              }`}
              onClick={() => onSelectTag(tag)}
            >
              {tag} <span className="text-sm">({count})</span>
            </li>
          );
        })}
      </ul>

      <article className="mt-12">
        <ul className="flex flex-col gap-y-4">
          {filterPosts.length < 1 && (
            <div>
              <p className="text-center italic">태그를 선택해주세요!</p>
            </div>
          )}
          {filterPosts.map((post) => {
            return (
              <li key={post.frontMatter.slug}>
                <PostItem {...post} />
              </li>
            );
          })}
        </ul>
      </article>
    </div>
  );
};

export async function getStaticProps() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      tags: tags,
    },
  };
}

export default TagsPage;

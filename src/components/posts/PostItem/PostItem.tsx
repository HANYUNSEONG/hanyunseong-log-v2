import { Post } from "@/types/post";
import dayjs from "dayjs";

const PostItem = ({ frontMatter }: Post) => {
  const { title, description, date, tags } = frontMatter;

  return (
    <article className="flex justify-end align-center gap-x-4 flex-1 gap-y-2 flex-col">
      <h2 className="font-bold text-xl">{title}</h2>
      <p className="text-sm">{description}</p>
      <ul className="flex gap-1">
        {tags.map((tag) => (
          <li key={`${title}-${tag}`}>
            <span className="p-1.5 text-xs rounded bg-slate-500 text-white">
              {tag}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs mt-2 text-gray-700">
        {dayjs(date).format("YYYY.MM.DD")}
      </p>
    </article>
  );
};

export default PostItem;

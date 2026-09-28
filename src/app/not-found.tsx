import Link from "next/link";

const NotFound = () => {
  return (
    <div className="py-24 text-center">
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-zinc-500">
        주소가 바뀌었거나 삭제된 글일 수 있어요.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        전체 글 보기
      </Link>
    </div>
  );
};

export default NotFound;

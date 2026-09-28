// 글과 UI에서 실제로 쓰는 글자만 남긴 Pretendard 서브셋을 만든다.
// 새 글의 글자도 포함되도록 dev/build 전에 매번 다시 생성한다.
import fs from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";

const SOURCE = "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2";
const OUTPUT = "src/fonts/PretendardSubset.woff2";
const TEXT_DIRS = ["posts", "src"];

function readFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return readFiles(file);
    return /\.(mdx|tsx?)$/.test(entry.name) ? [fs.readFileSync(file, "utf8")] : [];
  });
}

const chars = new Set(TEXT_DIRS.flatMap(readFiles).join(""));

// 본문에 없어도 쓰일 수 있는 ASCII 전체를 포함한다.
for (let code = 0x20; code < 0x7f; code++) chars.add(String.fromCharCode(code));

const font = await subsetFont(fs.readFileSync(SOURCE), [...chars].join(""), {
  targetFormat: "woff2",
  // 사이트에서 쓰는 굵기(font-normal ~ font-bold)만 남긴다.
  variationAxes: { wght: { min: 400, max: 700 } },
});

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, font);
console.log(`${OUTPUT}: ${chars.size} chars, ${(font.length / 1024).toFixed(1)}KB`);

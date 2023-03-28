import fs from "fs";
import { getAllPosts } from "./post";

const ROOT_URL = "https://hanyunseong-log.dev";

const generateSiteMap = (slugList: string[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${ROOT_URL}</loc>
     </url>
     ${slugList
       .map((slug) => {
         return `
       <url>
           <loc>${`${ROOT_URL}/post/${slug}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
};

const createSiteMap = async () => {
  const posts = await getAllPosts();

  if (posts && posts.length > 0) {
    const slugList = posts.map(({ frontMatter: { slug } }) => slug);
    const sitemap = generateSiteMap(slugList);

    fs.writeFileSync("public/sitemap.xml", sitemap, "utf-8");
  }
};

createSiteMap();

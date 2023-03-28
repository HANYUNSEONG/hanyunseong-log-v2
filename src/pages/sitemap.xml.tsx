import { Post } from "@/types/post";
import { getAllPosts } from "@/utils/post";
import { GetServerSidePropsContext } from "next";

const ROOT_URL = "https://hanyunseong-log.dev";

function generateSiteMap(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${ROOT_URL}</loc>
     </url>
     ${posts
       .map(({ frontMatter: { slug } }) => {
         return `
       <url>
           <loc>${`${ROOT_URL}/post/${slug}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const posts = await getAllPosts();

  if (posts) {
    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts);

    res.setHeader("Content-Type", "text/xml");

    // we send the XML to the browser
    res.write(sitemap);
    res.end();
  }

  return {
    props: {},
  };
}

export default SiteMap;

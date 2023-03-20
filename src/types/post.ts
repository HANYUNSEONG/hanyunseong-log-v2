export interface FrontMatter {
  title: string;
  description: string;
  date: string;
  published: boolean;
  slug: string;
  tags: string[];
}

export interface Post {
  frontMatter: FrontMatter;
  body: string;
  path: string;
}

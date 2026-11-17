import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { remarkCallouts, remarkMermaid } from "@/lib/remark-blog";

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags?: string[];
  // Series posts
  series?: string;
  seriesOrder?: number;
  section?: string;
  level?: string;
  prereqs?: string[]; // slugs of posts to read first
};

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type PostMeta = {
  slug: string;
  metadata: Metadata;
  readingMinutes: number;
};

// Open external links in blog posts in a new tab.
function rehypeExternalLinks() {
  const visit = (node: any) => {
    if (
      node.type === "element" &&
      node.tagName === "a" &&
      /^https?:\/\//.test(node.properties?.href ?? "")
    ) {
      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
    }
    node.children?.forEach(visit);
  };
  return (tree: any) => visit(tree);
}

function nodeText(node: any): string {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(nodeText).join("");
}

// Collect h2/h3 headings (after rehype-slug has given them ids) for the TOC.
function rehypeCollectToc(toc: TocItem[]) {
  return () => (tree: any) => {
    const visit = (node: any) => {
      if (
        node.type === "element" &&
        (node.tagName === "h2" || node.tagName === "h3") &&
        node.properties?.id
      ) {
        toc.push({
          id: String(node.properties.id),
          text: nodeText(node).trim(),
          depth: node.tagName === "h2" ? 2 : 3,
        });
        return;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const { html } = await markdownToHTMLWithToc(markdown);
  return html;
}

export async function markdownToHTMLWithToc(markdown: string) {
  const toc: TocItem[] = [];
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCallouts)
    .use(remarkMermaid)
    .use(remarkRehype)
    .use(rehypeExternalLinks)
    .use(rehypeSlug)
    .use(rehypeCollectToc(toc))
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaHidden: true, tabIndex: -1 },
      content: { type: "text", value: "#" },
    })
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return { html: p.toString(), toc };
}

export async function getPost(slug: string) {
  const filePath = path.join("content", `${slug}.mdx`);
  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data } = matter(source);
  const { html: content, toc } = await markdownToHTMLWithToc(rawContent);
  return {
    source: content,
    toc,
    metadata: data as Metadata,
    slug,
    readingMinutes: readingMinutes(rawContent),
  };
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source } = await getPost(slug);
      return {
        metadata,
        slug,
        source,
      };
    }),
  );
}

export async function getBlogPosts() {
  return getAllPosts(path.join(process.cwd(), "content"));
}

function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```mermaid[\s\S]*?```/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

// Frontmatter only: cheap enough to call from every page.
export function getPostsMeta(): PostMeta[] {
  const dir = path.join(process.cwd(), "content");
  return getMDXFiles(dir).map((file) => {
    const slug = path.basename(file, path.extname(file));
    const { content, data } = matter(
      fs.readFileSync(path.join(dir, file), "utf-8"),
    );
    return {
      slug,
      metadata: data as Metadata,
      readingMinutes: readingMinutes(content),
    };
  });
}

export function getSeriesPosts(series: string): PostMeta[] {
  return getPostsMeta()
    .filter((p) => p.metadata.series === series)
    .sort(
      (a, b) => (a.metadata.seriesOrder ?? 0) - (b.metadata.seriesOrder ?? 0),
    );
}

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
import { rehypeGlossaryAnchors, rehypeGlossaryLinks } from "@/lib/glossary";
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

// Wrap tables so wide ones scroll sideways instead of widening the page.
function rehypeScrollTables() {
  const visit = (node: any) => {
    node.children?.forEach((child: any, i: number) => {
      if (child.type === "element" && child.tagName === "table") {
        node.children[i] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [child],
        };
      } else {
        visit(child);
      }
    });
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

export async function markdownToHTMLWithToc(markdown: string, slug = "") {
  const toc: TocItem[] = [];
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCallouts)
    .use(remarkMermaid)
    .use(remarkRehype)
    .use(rehypeExternalLinks)
    .use(rehypeScrollTables)
    .use(rehypeGlossaryLinks(slug))
    .use(rehypeGlossaryAnchors(slug))
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
  const { html: content, toc } = await markdownToHTMLWithToc(rawContent, slug);
  return {
    source: content,
    toc,
    metadata: data as Metadata,
    slug,
    readingMinutes: readingMinutes(rawContent),
  };
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

// Topic pages (/blog/tag/<slug>). Post frontmatter `tags` use these slugs.
export const TOPICS: Record<string, { label: string; description: string }> = {
  rag: {
    label: "RAG",
    description:
      "Retrieval-augmented generation: embeddings, vector search, chunking, reranking and grounded answers.",
  },
  agents: {
    label: "Agents",
    description:
      "LLMs that act in a loop: tools, memory, LangGraph, MCP, multi-agent systems and human approval.",
  },
  "tool-calling": {
    label: "Tool calling",
    description:
      "Letting the model call your code: schemas, structured outputs, MCP and agent tools.",
  },
  prompting: {
    label: "Prompting and context",
    description:
      "Writing prompts, structuring outputs and deciding what goes into the context window.",
  },
  evals: {
    label: "Evals and observability",
    description:
      "Measuring LLM apps: eval sets, LLM judges, retrieval metrics, tracing and error analysis.",
  },
  security: {
    label: "Security",
    description:
      "Prompt injection, guardrails, sandboxes, permissions and least privilege.",
  },
  production: {
    label: "Production",
    description:
      "Running AI apps for real users: backends, deployment, reliability, monitoring and system design.",
  },
  "cost-and-latency": {
    label: "Cost and latency",
    description:
      "Making LLM apps fast and affordable: model choice, caching, streaming and retries.",
  },
  models: {
    label: "Models",
    description:
      "How LLMs and embedding models work, how to choose one, and when to fine-tune.",
  },
  interview: {
    label: "Interview prep",
    description:
      "Question banks, a glossary and system-design practice for AI engineering interviews.",
  },
};

export function topicLabel(slug: string) {
  return TOPICS[slug]?.label ?? slug;
}

export function getTopics() {
  const posts = getPostsMeta();
  return Object.keys(TOPICS)
    .map((slug) => ({
      slug,
      ...TOPICS[slug],
      count: posts.filter((p) => p.metadata.tags?.includes(slug)).length,
    }))
    .filter((t) => t.count > 0);
}

export function getPostsByTopic(slug: string): PostMeta[] {
  return getPostsMeta()
    .filter((p) => p.metadata.tags?.includes(slug))
    .sort(
      (a, b) =>
        (a.metadata.seriesOrder ?? 999) - (b.metadata.seriesOrder ?? 999),
    );
}

export function getSeriesPosts(series: string): PostMeta[] {
  return getPostsMeta()
    .filter((p) => p.metadata.series === series)
    .sort(
      (a, b) => (a.metadata.seriesOrder ?? 0) - (b.metadata.seriesOrder ?? 0),
    );
}

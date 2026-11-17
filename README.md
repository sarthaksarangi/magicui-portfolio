# sarthaksarangi.com

Personal site of Sarthak Sarangi, Full-Stack AI Engineer: portfolio, printable resume, and **[AI Engineering, Explained](https://sarthaksarangi.com/blog/ai-engineering-explained)**, a 23-part series on building with LLMs, from how models work to RAG, agents, evals and production.

**Live:** [sarthaksarangi.com](https://sarthaksarangi.com)

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Magic UI · unified (remark/rehype) · Mermaid · Vercel

## What's interesting in here

### A blog built from a Markdown pipeline

Posts are plain `.mdx` files in [`content/`](./content), turned into HTML at build time by a [unified](https://unifiedjs.com/) pipeline ([`src/data/blog.ts`](./src/data/blog.ts)). Each step is a small plugin:

- **Callouts and diagrams:** Obsidian-style `> [!tip]` callouts and ` ```mermaid ` blocks become styled asides and diagram figures ([`src/lib/remark-blog.ts`](./src/lib/remark-blog.ts)).
- **Glossary links:** the first use of each of ~120 glossary terms in a post links to its definition, with the definition as a tooltip. It skips headings, code, diagrams, and the post that explains the term ([`src/lib/glossary.ts`](./src/lib/glossary.ts)).
- **Navigation:** heading anchors, an "On this page" table of contents, a series progress bar, prev/next links, and topic pages at `/blog/tag/<topic>`.
- **Code:** syntax highlighting with light and dark themes, and a copy button.

### Diagrams that stay readable

Mermaid is loaded only when a diagram scrolls near the screen, and rendered SVGs are cached per theme ([`src/components/mermaid-diagrams.tsx`](./src/components/mermaid-diagrams.tsx)). Wide diagrams are tried top-to-bottom; if they still don't fit, they scroll sideways at a readable size and can open full screen, instead of shrinking the text until it can't be read.

### Link-preview images generated from one component

Every post gets its own 1200×630 preview image for LinkedIn, X and Slack: title, part number and a progress bar of the series. One React component ([`src/components/og/series-card.tsx`](./src/components/og/series-card.tsx)) is rendered to a PNG per post at build time by [`opengraph-image.tsx`](./src/app/blog/[slug]/opengraph-image.tsx) using `next/og`.

### Everything is static

Pages, preview images, the sitemap and the topic pages are all generated at build time, so the site is served as static files.

## Project layout

```
content/                 blog posts (.mdx with frontmatter)
src/app/                 routes: home, /resume, /blog, /blog/[slug], /blog/tag/[tag]
src/data/resume.tsx      all portfolio and resume content in one place
src/data/blog.ts         post loading and the Markdown-to-HTML pipeline
src/lib/                 remark/rehype plugins, glossary, OG image helpers
src/components/          UI, blog components, OG image design
assets/fonts/            Inter TTFs used for the preview images
```

## Run locally

Requires Node.js 20+ and pnpm.

```bash
git clone https://github.com/sarthaksarangi/portfolio
cd portfolio
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build, including all preview images
```

## Credits

Started from Dillion Verma's [portfolio template](https://github.com/dillionverma/portfolio) (MIT), built with [shadcn/ui](https://ui.shadcn.com/) and [Magic UI](https://magicui.design/). The blog system, content and everything above were added on top.

## License

[MIT](./LICENSE)

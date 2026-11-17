import { CodeCopyButtons } from "@/components/code-copy-buttons";
import { MermaidDiagrams } from "@/components/mermaid-diagrams";
import { Prereqs, SeriesHeader, SeriesPager } from "@/components/series-nav";
import { TableOfContents } from "@/components/table-of-contents";
import { TopicChips } from "@/components/topic-links";
import { getPost, getPostsMeta, getSeriesPosts } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  return getPostsMeta().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  let post = await getPost(slug);

  let {
    title,
    publishedAt: publishedTime,
    tags,
    summary: description,
    image,
  } = post.metadata;
  // Without a frontmatter `image`, the generated ./opengraph-image.tsx is
  // used (Next.js adds og:image for it automatically).
  const ogImage = image ? `${DATA.url}${image}` : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      ...(tags ? { tags } : {}),
      url: `${DATA.url}/blog/${post.slug}`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  let post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const { series } = post.metadata;
  const parts = series ? getSeriesPosts(series) : [];
  const meta = {
    slug: post.slug,
    metadata: post.metadata,
    readingMinutes: post.readingMinutes,
  };

  return (
    <section id="blog">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${DATA.url}${post.metadata.image}`
              : `${DATA.url}/blog/${post.slug}/opengraph-image`,
            url: `${DATA.url}/blog/${post.slug}`,
            ...(post.metadata.tags
              ? { keywords: post.metadata.tags.join(", ") }
              : {}),
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to blog
      </Link>
      {series && parts.length > 0 ? (
        <SeriesHeader post={meta} parts={parts} />
      ) : null}
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div
        className={`flex justify-between items-center mt-2 text-sm max-w-[650px] ${post.metadata.prereqs?.length ? "mb-3" : "mb-8"}`}
      >
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {post.metadata.level ? `${post.metadata.level} · ` : ""}
          {post.readingMinutes} min read
        </p>
      </div>
      <Prereqs slugs={post.metadata.prereqs} all={parts} />
      <TableOfContents items={post.toc} />
      <article
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.source }}
      ></article>
      <MermaidDiagrams />
      <CodeCopyButtons />
      <TopicChips tags={post.metadata.tags} className="mt-10 max-w-[650px]" />
      {series && parts.length > 0 ? (
        <SeriesPager post={meta} parts={parts} />
      ) : null}
    </section>
  );
}

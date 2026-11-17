import { TopicList } from "@/components/topic-links";
import { TOPICS, getPostsByTopic, getTopics } from "@/data/blog";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTopics().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const topic = TOPICS[tag];
  if (!topic) return {};
  const title = `${topic.label}: posts`;
  return {
    title,
    description: topic.description,
    alternates: { canonical: `${DATA.url}/blog/tag/${tag}` },
    openGraph: {
      title,
      description: topic.description,
      url: `${DATA.url}/blog/tag/${tag}`,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const topic = TOPICS[tag];
  const posts = getPostsByTopic(tag);
  if (!topic || posts.length === 0) notFound();

  return (
    <section>
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to blog
      </Link>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Topic · {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>
      <h1 className="font-medium text-2xl tracking-tighter mt-1">
        {topic.label}
      </h1>
      <p className="text-sm text-muted-foreground mt-2 mb-8 max-w-[650px]">
        {topic.description}
      </p>

      <ol className="space-y-6 mb-12">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block">
              <p className="text-xs text-muted-foreground">
                {p.metadata.seriesOrder
                  ? `Part ${p.metadata.seriesOrder}${p.metadata.section ? ` · ${p.metadata.section}` : ""}`
                  : "Article"}
                {p.metadata.level ? ` · ${p.metadata.level}` : ""} ·{" "}
                {p.readingMinutes} min read
              </p>
              <p className="font-medium tracking-tight group-hover:underline">
                {p.metadata.title}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {p.metadata.summary}
              </p>
            </Link>
          </li>
        ))}
      </ol>

      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Other topics
      </p>
      <TopicList topics={getTopics()} current={tag} />
    </section>
  );
}

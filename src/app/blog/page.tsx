import BlurFade from "@/components/magicui/blur-fade";
import { getPostsMeta, type PostMeta } from "@/data/blog";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description:
    "Notes on AI engineering: RAG, LLM agents, evaluation, and building full-stack AI products.",
};

const BLUR_FADE_DELAY = 0.04;

const byDateDesc = (a: PostMeta, b: PostMeta) =>
  new Date(b.metadata.publishedAt).getTime() -
  new Date(a.metadata.publishedAt).getTime();

export default async function BlogPage() {
  const posts = getPostsMeta();

  // Group series posts; everything else is listed by date.
  const series = new Map<string, PostMeta[]>();
  for (const post of posts) {
    const name = post.metadata.series;
    if (!name) continue;
    series.set(name, [...(series.get(name) ?? []), post]);
  }
  const standalone = posts.filter((p) => !p.metadata.series).sort(byDateDesc);

  let delay = BLUR_FADE_DELAY * 2;

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">Blog</h1>
      </BlurFade>

      {Array.from(series.entries()).map(([name, parts]) => {
        parts.sort(
          (a, b) =>
            (a.metadata.seriesOrder ?? 0) - (b.metadata.seriesOrder ?? 0),
        );
        const index = parts[0];
        const numbered = parts.filter((p) => (p.metadata.seriesOrder ?? 0) > 0);
        const sections = new Map<string, PostMeta[]>();
        for (const p of numbered) {
          const s = p.metadata.section ?? "";
          sections.set(s, [...(sections.get(s) ?? []), p]);
        }
        delay += 0.05;
        return (
          <BlurFade delay={delay} key={name}>
            <div className="rounded-lg border p-5 mb-10">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Series · {numbered.length} parts
              </p>
              <Link href={`/blog/${index.slug}`} className="block mt-1">
                <p className="text-lg font-medium tracking-tight hover:underline">
                  {name}
                </p>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                {index.metadata.summary}
              </p>
              <details className="mt-4 group">
                <summary className="cursor-pointer text-sm font-medium select-none">
                  Show all parts
                </summary>
                <div className="mt-3 space-y-4">
                  {Array.from(sections.entries()).map(([section, items]) => (
                    <div key={section}>
                      {section ? (
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {section}
                        </p>
                      ) : null}
                      <ol className="space-y-1">
                        {items.map((p) => (
                          <li key={p.slug} className="text-sm">
                            <Link
                              href={`/blog/${p.slug}`}
                              className="hover:underline"
                            >
                              <span className="text-muted-foreground tabular-nums mr-2">
                                {p.metadata.seriesOrder}.
                              </span>
                              {p.metadata.title}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </BlurFade>
        );
      })}

      {standalone.map((post, id) => (
        <BlurFade delay={delay + 0.05 + id * 0.05} key={post.slug}>
          <Link
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="tracking-tight">{post.metadata.title}</p>
              <p className="h-6 text-xs text-muted-foreground">
                {post.metadata.publishedAt}
              </p>
            </div>
          </Link>
        </BlurFade>
      ))}
    </section>
  );
}

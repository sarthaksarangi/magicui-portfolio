import type { PostMeta } from "@/data/blog";
import Link from "next/link";

export function SeriesHeader({
  post,
  parts,
}: {
  post: PostMeta;
  parts: PostMeta[];
}) {
  const { series, seriesOrder, section } = post.metadata;
  const index = parts[0];
  const numbered = parts.filter((p) => (p.metadata.seriesOrder ?? 0) > 0);
  return (
    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
      <Link href={`/blog/${index.slug}`} className="hover:text-foreground">
        {series}
      </Link>
      {seriesOrder ? (
        <>
          {" · "}Part {seriesOrder} of {numbered.length}
          {section ? ` · ${section}` : ""}
        </>
      ) : null}
    </p>
  );
}

export function Prereqs({
  slugs,
  all,
}: {
  slugs?: string[];
  all: PostMeta[];
}) {
  const posts = (slugs ?? [])
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is PostMeta => Boolean(p));
  if (posts.length === 0) return null;
  return (
    <p className="text-sm text-muted-foreground mb-8 max-w-[650px]">
      Read first:{" "}
      {posts.map((p, i) => (
        <span key={p.slug}>
          {i > 0 ? ", " : ""}
          <Link
            href={`/blog/${p.slug}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {p.metadata.title}
          </Link>
        </span>
      ))}
    </p>
  );
}

export function SeriesPager({
  post,
  parts,
}: {
  post: PostMeta;
  parts: PostMeta[];
}) {
  const at = parts.findIndex((p) => p.slug === post.slug);
  const prev = at > 0 ? parts[at - 1] : undefined;
  const next = at >= 0 && at < parts.length - 1 ? parts[at + 1] : undefined;
  const label = (p: PostMeta) =>
    p.metadata.seriesOrder ? `Part ${p.metadata.seriesOrder}` : "Start here";

  return (
    <nav className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[65ch]">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="rounded-lg border p-4 hover:bg-muted transition-colors"
        >
          <p className="text-xs text-muted-foreground">← {label(prev)}</p>
          <p className="text-sm font-medium mt-1">{prev.metadata.title}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="rounded-lg border p-4 text-right hover:bg-muted transition-colors"
        >
          <p className="text-xs text-muted-foreground">{label(next)} →</p>
          <p className="text-sm font-medium mt-1">{next.metadata.title}</p>
        </Link>
      ) : null}
    </nav>
  );
}

// Where this post sits in the series: one tick per part, grouped by
// section, with the current part raised. Each tick links to its part.
// Same design as the link-preview image (components/og/series-card.tsx).
export function SeriesProgress({
  post,
  parts,
}: {
  post: PostMeta;
  parts: PostMeta[];
}) {
  const current = post.metadata.seriesOrder || undefined;
  const sections: { name: string; parts: PostMeta[] }[] = [];
  for (const p of parts) {
    if (!p.metadata.seriesOrder) continue; // the "Start here" index has no tick
    const name = p.metadata.section ?? "";
    const last = sections[sections.length - 1];
    if (last?.name === name) last.parts.push(p);
    else sections.push({ name, parts: [p] });
  }
  if (sections.length === 0) return null;

  return (
    <nav aria-label="Series progress" className="mb-5 max-w-[650px]">
      <ol className="flex gap-2 sm:gap-3">
        {sections.map((s, i) => {
          const here = s.parts.some((p) => p.metadata.seriesOrder === current);
          const isLast = i === sections.length - 1;
          return (
            // Width proportional to the number of parts, so every tick is
            // the same width; labels may be wider than their group.
            <li
              key={s.name}
              className="flex flex-col gap-1 min-w-0"
              style={{ flex: `${s.parts.length} 1 0%` }}
            >
              <div className="flex gap-[3px]">
                {s.parts.map((p) => {
                  const n = p.metadata.seriesOrder!;
                  const isCurrent = n === current;
                  return (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      prefetch={false}
                      title={`Part ${n}: ${p.metadata.title}`}
                      aria-label={`Part ${n}: ${p.metadata.title}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className="group flex-1 flex items-center h-4"
                    >
                      <span
                        className={
                          isCurrent
                            ? "block w-full h-2 rounded-sm bg-foreground"
                            : "block w-full h-1 rounded-sm bg-muted-foreground/30 group-hover:bg-muted-foreground/70 transition-colors"
                        }
                      />
                    </Link>
                  );
                })}
              </div>
              <span
                className={`hidden sm:block whitespace-nowrap text-[11px] ${isLast ? "self-end" : ""} ${here ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {s.name}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

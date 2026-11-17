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

import { TOPICS, topicLabel } from "@/data/blog";
import Link from "next/link";

const chip =
  "inline-block rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors";

// Topic chips for a post. Unknown tags (not in TOPICS) are not shown,
// since they have no topic page.
export function TopicChips({
  tags,
  className = "",
}: {
  tags?: string[];
  className?: string;
}) {
  const topics = (tags ?? []).filter((t) => t in TOPICS);
  if (topics.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Topics">
      {topics.map((t) => (
        <li key={t}>
          <Link href={`/blog/tag/${t}`} className={chip}>
            {topicLabel(t)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TopicList({
  topics,
  current,
}: {
  topics: { slug: string; label: string; count: number }[];
  current?: string;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Browse by topic">
      {topics.map((t) => (
        <li key={t.slug}>
          <Link
            href={`/blog/tag/${t.slug}`}
            aria-current={t.slug === current ? "page" : undefined}
            className={`${chip} ${t.slug === current ? "!text-foreground border-foreground/60" : ""}`}
          >
            {t.label}
            <span className="ml-1.5 tabular-nums opacity-60">{t.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

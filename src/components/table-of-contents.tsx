import type { TocItem } from "@/data/blog";

// Collapsible "On this page" list built from the post's h2/h3 headings.
// The site is a single narrow column, so it sits above the article
// instead of in a sidebar. Works without JavaScript (<details>).
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.filter((i) => i.depth === 2).length < 3) return null;
  return (
    <details className="toc group mb-8 max-w-[650px] rounded-lg border px-4 py-3 text-sm">
      <summary className="cursor-pointer select-none font-medium text-muted-foreground hover:text-foreground">
        On this page
        <span className="ml-2 text-xs font-normal">({items.length})</span>
      </summary>
      <nav aria-label="Table of contents" className="mt-3">
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
              <a
                href={`#${item.id}`}
                className={`hover:text-foreground ${item.depth === 3 ? "text-muted-foreground" : ""}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

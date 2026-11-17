import fs from "fs";
import path from "path";

// Links the first use of each glossary term in a post to its entry in the
// glossary post (content/glossary.mdx), with the definition as a tooltip.
//
// Glossary entries are list items written as:
//   - **Term (expansion)**: Definition. See [Post title](/blog/post-slug).

export const GLOSSARY_SLUG = "glossary";

// Terms that are ordinary English words in most sentences; linking them
// would usually point at the wrong meaning.
const SKIP_TERMS = new Set([
  "Node",
  "Overlap",
  "Span",
  "Thread",
  "Worker",
  "Interrupt",
  "Attention",
]);

export type GlossaryEntry = {
  id: string;
  term: string;
  forms: string[]; // the term and its expansion, as they may appear in text
  definition: string;
  explainedIn?: string; // slug of the post that explains the term
};

export function termId(term: string) {
  return (
    "term-" +
    term
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

function plainText(markdown: string) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}

let cached: GlossaryEntry[] | null = null;

export function getGlossary(): GlossaryEntry[] {
  if (cached) return cached;
  const file = path.join(process.cwd(), "content", `${GLOSSARY_SLUG}.mdx`);
  if (!fs.existsSync(file)) return (cached = []);
  const entries: GlossaryEntry[] = [];
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    const m = line.match(/^- \*\*(.+?)\*\*:\s*(.+)$/);
    if (!m) continue;
    const [, term, rest] = m;
    const see = rest.match(/\s*See \[[^\]]+\]\(\/blog\/([^)#\s]+)[^)]*\)\.?\s*$/);
    const definition = plainText(see ? rest.slice(0, see.index) : rest);
    const main = term.replace(/\s*\(.*\)\s*$/, "").trim();
    const expansion = term.match(/\((.+)\)/)?.[1].trim();
    entries.push({
      id: termId(term),
      term,
      forms: [main, ...(expansion ? [expansion] : [])],
      definition,
      explainedIn: see?.[1],
    });
  }
  return (cached = entries);
}

// A form is matched case-sensitively when its capitalisation carries
// meaning (RAG, BM25, pgvector, LangGraph); otherwise case-insensitively.
function caseSensitive(form: string) {
  return form !== form[0] + form.slice(1).toLowerCase();
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SKIP_TAGS = new Set([
  "a",
  "code",
  "pre",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "figure",
  "button",
]);

function skipElement(node: any) {
  if (SKIP_TAGS.has(node.tagName)) return true;
  const cls = node.properties?.className;
  return Array.isArray(cls) && cls.includes("callout-title");
}

export function rehypeGlossaryLinks(slug: string) {
  return () => (tree: any) => {
    if (slug === GLOSSARY_SLUG) return;
    const entries = getGlossary().filter(
      (e) => e.explainedIn !== slug && !SKIP_TERMS.has(e.forms[0]),
    );
    if (entries.length === 0) return;

    const byForm = new Map<string, { entry: GlossaryEntry; form: string }>();
    for (const entry of entries)
      for (const form of entry.forms)
        byForm.set(form.toLowerCase(), { entry, form });
    // Longest first, so "Agentic RAG" wins over "RAG".
    const alternatives = Array.from(byForm.values())
      .map((v) => v.form)
      .sort((a, b) => b.length - a.length)
      .map(escape);
    const pattern = new RegExp(
      `(?<![\\w-])(${alternatives.join("|")})(?:s|es)?(?![\\w-])`,
      "gi",
    );
    const linked = new Set<string>();

    const linkText = (value: string) => {
      const parts: any[] = [];
      let last = 0;
      pattern.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(value))) {
        const hit = byForm.get(m[1].toLowerCase());
        if (
          !hit ||
          linked.has(hit.entry.id) ||
          (caseSensitive(hit.form) && m[1] !== hit.form)
        ) {
          pattern.lastIndex = m.index + 1;
          continue;
        }
        linked.add(hit.entry.id);
        if (m.index > last)
          parts.push({ type: "text", value: value.slice(last, m.index) });
        parts.push({
          type: "element",
          tagName: "a",
          properties: {
            href: `/blog/${GLOSSARY_SLUG}#${hit.entry.id}`,
            className: ["glossary-term"],
            title: hit.entry.definition,
          },
          children: [{ type: "text", value: m[0] }],
        });
        last = m.index + m[0].length;
      }
      if (parts.length === 0) return null;
      if (last < value.length)
        parts.push({ type: "text", value: value.slice(last) });
      return parts;
    };

    const visit = (node: any) => {
      if (!node.children) return;
      const next: any[] = [];
      for (const child of node.children) {
        if (child.type === "text") {
          const parts = linkText(child.value);
          if (parts) next.push(...parts);
          else next.push(child);
        } else {
          if (child.type === "element" && !skipElement(child)) visit(child);
          next.push(child);
        }
      }
      node.children = next;
    };
    visit(tree);
  };
}

// On the glossary post itself: give each entry an id so links can target it.
export function rehypeGlossaryAnchors(slug: string) {
  return () => (tree: any) => {
    if (slug !== GLOSSARY_SLUG) return;
    const text = (n: any): string =>
      n.type === "text" ? n.value : (n.children ?? []).map(text).join("");
    const visit = (node: any) => {
      if (node.type === "element" && node.tagName === "li") {
        const first = node.children?.find(
          (c: any) => !(c.type === "text" && !c.value.trim()),
        );
        const strong =
          first?.tagName === "strong"
            ? first
            : first?.tagName === "p"
              ? first.children?.[0]
              : null;
        if (strong?.tagName === "strong") {
          node.properties = { ...node.properties, id: termId(text(strong)) };
          return;
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

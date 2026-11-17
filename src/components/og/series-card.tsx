// The design of every blog post's link-preview image.
//
// This is a plain React component, but it is never shown on a page.
// next/og's ImageResponse turns it into a PNG (see
// app/blog/[slug]/opengraph-image.tsx). That renderer (Satori) supports a
// subset of CSS: flexbox layout, inline `style` objects only (no Tailwind
// classes), and every element with more than one child must be
// `display: flex`. Text that mixes strings and variables is written as a
// template string so it stays a single text node.

export type SeriesSection = { name: string; parts: number[] };

export type SeriesCardProps = {
  title: string;
  site: string;
  meta: string[]; // e.g. ["RAG", "Beginner", "15 min read"]
  // Series posts:
  series?: string;
  part?: number; // 0 or undefined = not a numbered part (e.g. the index)
  totalParts?: number;
  sections?: SeriesSection[];
  // Shown instead of the progress bar on posts outside a series.
  summary?: string;
};

const color = {
  bg: "#0a0a0a",
  fg: "#fafafa",
  muted: "#a1a1aa",
  line: "#27272a",
  tick: "#3f3f46",
};

// Shrink long titles so they fit in two or three lines.
function titleSize(title: string) {
  if (title.length <= 24) return 92;
  if (title.length <= 40) return 76;
  return 60;
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).replace(/[,.;:]$/, "") + "…";
}

// One tick per part, grouped by section; the current part is taller and
// white, and its section label is highlighted.
function Progress({
  sections,
  part,
}: {
  sections: SeriesSection[];
  part?: number;
}) {
  return (
    <div style={{ display: "flex", gap: 18 }}>
      {sections.map((s) => {
        const here = part !== undefined && s.parts.includes(part);
        return (
          <div
            key={s.name}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {s.parts.map((n) => (
                <div
                  key={n}
                  style={{
                    width: 34,
                    height: n === part ? 14 : 6,
                    marginTop: n === part ? 0 : 8,
                    borderRadius: 3,
                    background: n === part ? color.fg : color.tick,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: 17,
                color: here ? color.fg : color.muted,
                fontWeight: here ? 600 : 400,
              }}
            >
              {s.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SeriesCard(props: SeriesCardProps) {
  const { title, site, meta, series, part, totalParts, sections, summary } =
    props;
  const size = titleSize(title);

  const right = part
    ? `Part ${part} of ${totalParts}`
    : series
      ? `${totalParts} parts`
      : "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: color.bg,
        color: color.fg,
        fontFamily: "Inter",
      }}
    >
      {/* Header: series name, part number */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: color.muted,
        }}
      >
        <div>{series ?? "Blog"}</div>
        <div style={{ color: color.fg }}>{right}</div>
      </div>

      {/* Body: title, then progress bar (series) or summary (other posts) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 52 }}>
        <div
          style={{
            fontSize: size,
            fontWeight: 600,
            letterSpacing: -size * 0.035,
            lineHeight: 1.06,
            maxWidth: 1040,
          }}
        >
          {/* Non-breaking hyphens keep "Human-in-the-Loop" on one line. */}
          {title.replace(/(?<=\w)-(?=\w)/g, "‑")}
        </div>
        {sections && sections.length > 0 ? (
          <Progress sections={sections} part={part || undefined} />
        ) : summary ? (
          <div style={{ fontSize: 30, lineHeight: 1.4, color: color.muted }}>
            {clip(summary, 110)}
          </div>
        ) : null}
      </div>

      {/* Footer: site, section · level · reading time */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: color.muted,
          borderTop: `1px solid ${color.line}`,
          paddingTop: 28,
        }}
      >
        <div style={{ color: color.fg, fontWeight: 500 }}>{site}</div>
        <div>{meta.join("  ·  ")}</div>
      </div>
    </div>
  );
}

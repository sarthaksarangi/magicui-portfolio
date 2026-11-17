import fs from "fs";
import path from "path";

// Shared settings for generated Open Graph images (link previews on
// LinkedIn, X, Slack, WhatsApp...). 1200x630 is the size every major
// platform expects.
export const OG_SIZE = { width: 1200, height: 630 };

// The image renderer (Satori, inside next/og) has no access to the page's
// CSS or web fonts, so fonts are passed in as raw TTF bytes. The files live
// in assets/fonts and are read at build time.
const WEIGHTS = [400, 500, 600] as const;

let cached: ReturnType<typeof read> | null = null;

function read() {
  return WEIGHTS.map((weight) => ({
    name: "Inter",
    data: fs.readFileSync(
      path.join(process.cwd(), "assets/fonts", `Inter-${weight}.ttf`),
    ),
    weight,
    style: "normal" as const,
  }));
}

export function ogFonts() {
  return (cached ??= read());
}

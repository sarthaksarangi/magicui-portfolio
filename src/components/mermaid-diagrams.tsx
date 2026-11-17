"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

// Renders every <figure class="mermaid-diagram"> on the page to SVG.
//
// - Mermaid is loaded only when a diagram comes near the viewport, and each
//   diagram is rendered lazily as it approaches (IntersectionObserver).
// - Rendered SVGs are cached per theme + source, so toggling the theme back
//   and forth, or revisiting a post, does not re-run Mermaid.
// - Diagrams re-render when the light/dark theme changes.
// - Each diagram is scaled down to fit the text column if that keeps it at
//   FIT_FLOOR or larger. A wider diagram is shown at SCROLL_SCALE instead,
//   scrolls sideways inside its own box, and gets an "Expand" button
//   (full-size overlay), so labels stay readable.
// - A wide left-to-right flowchart is also tried top-to-bottom, and the
//   narrower one is kept.
// - Without JavaScript the diagram source stays visible as a fallback.

const FIT_FLOOR = 0.6;
const SCROLL_SCALE = 0.7;
const LR = /^(\s*(?:flowchart|graph|direction)\s+)LR\b/gm;

type Rendered = { svg: string; width: number };

let renderCount = 0;
const cache = new Map<string, Promise<Rendered>>();
let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
let initializedTheme: string | null = null;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((m) => m.default);
  return mermaidPromise;
}

function naturalWidth(svg: string) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1].split(/[\s,]+/);
  return Number(viewBox?.[2]) || 1;
}

// Mermaid keeps global config, so renders must not interleave themes.
// All renders go through one chain.
let queue: Promise<unknown> = Promise.resolve();

function render(theme: string, source: string): Promise<Rendered> {
  const key = `${theme}\n${source}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = new Promise<Rendered>((resolve, reject) => {
      queue = queue.then(async () => {
        try {
          const mermaid = await loadMermaid();
          if (initializedTheme !== theme) {
            const config = { useMaxWidth: false };
            mermaid.initialize({
              startOnLoad: false,
              securityLevel: "strict",
              theme: theme === "dark" ? "dark" : "neutral",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              flowchart: config,
              state: config,
              class: config,
              er: config,
              sequence: {
                ...config,
                wrap: true,
                width: 130,
                actorMargin: 40,
                mirrorActors: false,
              },
            });
            initializedTheme = theme;
          }
          const { svg } = await mermaid.render(
            `mermaid-${++renderCount}`,
            source,
          );
          resolve({ svg, width: naturalWidth(svg) });
        } catch (error) {
          cache.delete(key);
          reject(error);
        }
      });
    });
    cache.set(key, hit);
  }
  return hit;
}

function openOverlay(svg: string) {
  const overlay = document.createElement("div");
  overlay.className = "mermaid-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Diagram at full size");
  overlay.innerHTML = `<button type="button" class="mermaid-overlay-close" aria-label="Close">Close ✕</button><div class="mermaid-overlay-body">${svg}</div>`;

  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
  };
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector("button")?.addEventListener("click", close);
  document.addEventListener("keydown", onKey);
  document.body.style.overflow = "hidden";
  document.body.appendChild(overlay);
  (overlay.querySelector("button") as HTMLButtonElement).focus();
}

async function drawFigure(
  figure: HTMLElement,
  theme: string,
  isCancelled: () => boolean,
) {
  const source =
    figure.dataset.source ??
    figure.querySelector("pre.mermaid")?.textContent ??
    "";
  figure.dataset.source = source;

  let output = figure.querySelector<HTMLElement>(".mermaid-svg");
  if (!output) {
    output = document.createElement("div");
    output.className = "mermaid-svg";
    figure.appendChild(output);
  }

  try {
    const column = figure.clientWidth || 600;
    let best = await render(theme, source);
    LR.lastIndex = 0;
    if (column / best.width < 1 && LR.test(source)) {
      const tb = await render(theme, source.replace(LR, "$1TB"));
      if (tb.width < best.width) best = tb;
    }
    if (isCancelled()) return;

    const fit = column / best.width;
    const scrolls = fit < FIT_FLOOR;
    const scale = scrolls ? SCROLL_SCALE : Math.min(1, fit);
    output.innerHTML = best.svg;
    const svg = output.querySelector("svg") as SVGSVGElement;
    svg.removeAttribute("height");
    svg.style.maxWidth = "none";
    svg.style.width = `${best.width * scale}px`;
    svg.style.height = "auto";
    output.classList.toggle("scrolls", scrolls);
    figure.dataset.rendered = theme;
    delete figure.dataset.failed;

    figure.querySelector(".mermaid-expand")?.remove();
    figure.classList.remove("expandable");
    figure.onclick = null;
    if (scrolls) {
      figure.classList.add("expandable");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mermaid-expand";
      button.textContent = "Expand ⤢";
      button.setAttribute("aria-label", "Open diagram at full size");
      button.onclick = (e) => {
        e.stopPropagation();
        openOverlay(best.svg);
      };
      figure.appendChild(button);
      // Clicking the diagram also expands it, unless the reader is
      // scrolling it sideways.
      svg.addEventListener("click", () => openOverlay(best.svg));
    }
  } catch (error) {
    figure.dataset.failed = "true";
    console.error("Mermaid diagram failed to render", error);
  }
}

export function MermaidDiagrams() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // next-themes resolves the theme after mount; wait for it so each
    // diagram is rendered once, in the right theme.
    if (!resolvedTheme) return;
    const theme = resolvedTheme;
    const figures = Array.from(
      document.querySelectorAll<HTMLElement>("figure.mermaid-diagram"),
    );
    if (figures.length === 0) return;
    let cancelled = false;
    const isCancelled = () => cancelled;

    // Already-drawn diagrams switch theme right away; the rest wait
    // until they come near the viewport.
    const pending: HTMLElement[] = [];
    for (const figure of figures) {
      if (figure.dataset.rendered && figure.dataset.rendered !== theme) {
        drawFigure(figure, theme, isCancelled);
      } else if (!figure.dataset.rendered) {
        pending.push(figure);
      }
    }

    if (!("IntersectionObserver" in window)) {
      pending.forEach((f) => drawFigure(f, theme, isCancelled));
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          drawFigure(entry.target as HTMLElement, theme, isCancelled);
        }
      },
      { rootMargin: "800px 0px" },
    );
    pending.forEach((f) => observer.observe(f));

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [resolvedTheme]);

  return null;
}

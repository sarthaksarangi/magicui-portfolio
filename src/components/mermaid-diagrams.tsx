"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

// Renders every <figure class="mermaid-diagram"> on the page to SVG.
//
// - Mermaid is loaded only on pages that have diagrams.
// - Diagrams re-render when the light/dark theme changes.
// - Each diagram is scaled to fit the text column. A wide left-to-right
//   flowchart is also tried top-to-bottom, and the more readable one is kept.
// - If fitting would shrink the text below MIN_SCALE, an "Expand" button
//   (and clicking the diagram) opens it at full size in an overlay.
// - Without JavaScript the diagram source stays visible as a fallback.

const MIN_SCALE = 0.65;

let renderCount = 0;

async function renderAndMeasure(
  mermaid: typeof import("mermaid").default,
  host: HTMLElement,
  source: string,
) {
  const { svg } = await mermaid.render(`mermaid-${++renderCount}`, source);
  host.innerHTML = svg;
  const el = host.querySelector("svg") as SVGSVGElement;
  el.style.maxWidth = "none";
  const width = el.getBoundingClientRect().width || 1;
  return { svg, width };
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

export function MermaidDiagrams() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const figures = Array.from(
      document.querySelectorAll<HTMLElement>("figure.mermaid-diagram"),
    );
    if (figures.length === 0) return;
    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;
      const config = { useMaxWidth: false };
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: resolvedTheme === "dark" ? "dark" : "neutral",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        flowchart: config,
        sequence: config,
        state: config,
        class: config,
        er: config,
      });

      for (const figure of figures) {
        if (cancelled) return;
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
          // Measure off-layout so the column width is not affected.
          output.classList.add("measuring");
          const column = figure.clientWidth || 600;
          let best = await renderAndMeasure(mermaid, output, source);

          const leftToRight = /^\s*(flowchart|graph)\s+LR\b/;
          if (column / best.width < MIN_SCALE && leftToRight.test(source)) {
            const tb = await renderAndMeasure(
              mermaid,
              output,
              source.replace(leftToRight, "$1 TB"),
            );
            if (tb.width < best.width) best = tb;
          }
          if (cancelled) return;

          output.innerHTML = best.svg;
          output.classList.remove("measuring");
          const svg = output.querySelector("svg") as SVGSVGElement;
          svg.style.maxWidth = "100%";
          svg.style.height = "auto";
          figure.dataset.rendered = "true";

          figure.querySelector(".mermaid-expand")?.remove();
          figure.classList.remove("expandable");
          figure.onclick = null;
          if (column / best.width < MIN_SCALE) {
            figure.classList.add("expandable");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "mermaid-expand";
            button.textContent = "Expand ⤢";
            button.setAttribute("aria-label", "Open diagram at full size");
            figure.appendChild(button);
            figure.onclick = () => openOverlay(best.svg);
          }
        } catch (error) {
          output.classList.remove("measuring");
          figure.dataset.failed = "true";
          console.error("Mermaid diagram failed to render", error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedTheme]);

  return null;
}

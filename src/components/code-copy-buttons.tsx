"use client";

import { useEffect } from "react";

// Adds a "Copy" button to every code block in the article. Code blocks are
// server-rendered HTML (rehype-pretty-code), so the buttons are attached
// after hydration. Mermaid source blocks are skipped.

function codeText(pre: HTMLPreElement) {
  const lines = pre.querySelectorAll<HTMLElement>("[data-line]");
  if (lines.length === 0) return pre.innerText;
  return Array.from(lines, (l) => l.textContent ?? "").join("\n");
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts (e.g. LAN dev server).
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function CodeCopyButtons() {
  useEffect(() => {
    const added: HTMLElement[] = [];
    document
      .querySelectorAll<HTMLPreElement>("article.prose pre")
      .forEach((pre) => {
        if (pre.closest("figure.mermaid-diagram")) return;
        let wrapper = pre.parentElement;
        if (!wrapper?.matches("figure[data-rehype-pretty-code-figure]")) {
          wrapper = document.createElement("div");
          pre.replaceWith(wrapper);
          wrapper.appendChild(pre);
        }
        if (wrapper.querySelector(":scope > .code-copy")) return;
        wrapper.classList.add("code-copy-host");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "code-copy";
        button.textContent = "Copy";
        button.setAttribute("aria-label", "Copy code to clipboard");
        let timer: number | undefined;
        button.addEventListener("click", async () => {
          const ok = await copy(codeText(pre));
          button.textContent = ok ? "Copied" : "Failed";
          window.clearTimeout(timer);
          timer = window.setTimeout(() => (button.textContent = "Copy"), 1500);
        });
        wrapper.appendChild(button);
        added.push(button);
      });
    return () => added.forEach((b) => b.remove());
  }, []);

  return null;
}

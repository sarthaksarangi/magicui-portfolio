"use client";

import { Icons } from "@/components/icons";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

// Share row at the end of a post: copy link, LinkedIn, and the device's
// own share sheet (only where the browser supports it, mostly phones).
// No third-party scripts: LinkedIn is a plain link to its share page.

const button =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers that block the clipboard API.
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

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  // Decided after mount, so the server HTML and first client render match.
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2 max-w-[650px]">
      {/* Own line on phones, so the three buttons share one row. */}
      <span className="w-full sm:w-auto text-xs text-muted-foreground mr-1">
        Share this post
      </span>
      <button
        type="button"
        className={button}
        onClick={async () => setCopied(await copyText(url))}
        aria-live="polite"
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <LinkIcon className="size-3.5" aria-hidden />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        className={button}
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icons.linkedin className="size-3.5" aria-hidden />
        LinkedIn
      </a>
      {canShare ? (
        <button
          type="button"
          className={button}
          onClick={() => {
            // Closing the share sheet rejects the promise; that's not an error.
            navigator.share({ title, url }).catch(() => {});
          }}
        >
          <Share2 className="size-3.5" aria-hidden />
          Share…
        </button>
      ) : null}
    </div>
  );
}

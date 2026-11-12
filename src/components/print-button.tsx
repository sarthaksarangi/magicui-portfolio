"use client";

import { DownloadIcon } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 print:hidden"
    >
      <DownloadIcon className="size-3.5" />
      Download PDF
    </button>
  );
}

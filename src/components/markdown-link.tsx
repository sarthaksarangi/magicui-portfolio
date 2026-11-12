import type { ComponentPropsWithoutRef } from "react";

// Links written in Markdown content: external ones open in a new tab,
// while internal and mailto links keep the default behaviour.
export function MarkdownLink({
  href,
  children,
  node: _node,
  ...props
}: ComponentPropsWithoutRef<"a"> & { node?: unknown }) {
  const external = /^https?:\/\//.test(href ?? "");
  return (
    <a
      href={href}
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

// Remark plugins for blog posts.
//
// remarkCallouts: "> [!tip] Title\n> body"  ->  <aside class="callout callout-tip">
//                 The first line is the title; a one-line callout gets a default title.
// remarkMermaid:  ```mermaid blocks -> <figure class="mermaid-diagram"><pre class="mermaid">
//                 rendered to SVG in the browser by <MermaidDiagrams />.

/* eslint-disable @typescript-eslint/no-explicit-any */

const CALLOUT_LABELS: Record<string, string> = {
  summary: "In short",
  abstract: "In short",
  tldr: "In short",
  tip: "Tip",
  hint: "Tip",
  warning: "Watch out",
  caution: "Watch out",
  example: "Example",
  note: "Note",
  info: "Note",
  important: "Important",
  question: "Question",
};

function visit(node: any, fn: (n: any) => void) {
  fn(node);
  node.children?.forEach((child: any) => visit(child, fn));
}

function label(kind: string) {
  return CALLOUT_LABELS[kind] ?? kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function remarkCallouts() {
  return (tree: any) =>
    visit(tree, (node) => {
      if (node.type !== "blockquote") return;
      const first = node.children?.[0];
      if (first?.type !== "paragraph") return;
      const head = first.children?.[0];
      if (head?.type !== "text") return;
      const match = /^\[!(\w+)\][+-]?[ \t]*/.exec(head.value);
      if (!match) return;

      const kind = match[1].toLowerCase();
      head.value = head.value.slice(match[0].length);

      // Title = inline content up to the first line break.
      const titleNodes: any[] = [];
      let bodyNodes: any[] = [];
      let hasBreak = false;
      for (let i = 0; i < first.children.length; i++) {
        const child = first.children[i];
        if (child.type === "text" && child.value.includes("\n")) {
          const at = child.value.indexOf("\n");
          const before = child.value.slice(0, at);
          const after = child.value.slice(at + 1);
          if (before) titleNodes.push({ type: "text", value: before });
          if (after) bodyNodes.push({ type: "text", value: after });
          bodyNodes.push(...first.children.slice(i + 1));
          hasBreak = true;
          break;
        }
        titleNodes.push(child);
      }

      let titleChildren: any[];
      if (!hasBreak) {
        // One-line callout: everything is body, use the default title.
        titleChildren = [{ type: "text", value: label(kind) }];
        bodyNodes = first.children;
      } else if (titleNodes.every((t) => t.type === "text" && !t.value.trim())) {
        titleChildren = [{ type: "text", value: label(kind) }];
      } else {
        titleChildren = titleNodes;
      }

      const title = {
        type: "paragraph",
        children: titleChildren,
        data: { hProperties: { className: ["callout-title"] } },
      };
      const body = bodyNodes.length ? [{ ...first, children: bodyNodes }] : [];
      node.children = [title, ...body, ...node.children.slice(1)];
      node.data = {
        hName: "aside",
        hProperties: { className: ["callout", `callout-${kind}`] },
      };
    });
}

export function remarkMermaid() {
  return (tree: any) =>
    visit(tree, (node) => {
      if (node.type !== "code" || node.lang !== "mermaid") return;
      const source = node.value;
      node.type = "mermaidDiagram";
      delete node.lang;
      delete node.meta;
      delete node.value;
      node.data = {
        hName: "figure",
        hProperties: { className: ["mermaid-diagram"] },
        hChildren: [
          {
            type: "element",
            tagName: "pre",
            properties: { className: ["mermaid"] },
            children: [{ type: "text", value: source }],
          },
        ],
      };
    });
}

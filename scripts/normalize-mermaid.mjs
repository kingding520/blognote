/** Keep the diagram structure while letting the site's light/dark palette style it. */
export function normalizeMermaidSource(source) {
  return source
    // Diagram-level configuration can override the site's theme and text colors.
    .replace(/^\s*%%\{\s*(?:init|initialize)\s*:[\s\S]*?\}%%\s*\r?\n?/gim, '')
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    // Mermaid classes and inline styles are visual only; remove their references too.
    .replace(/^\s*(?:classDef|class|style|linkStyle)\s+[^\r\n]*\r?\n?/gim, '')
    .replace(/:::[A-Za-z_][\w-]*/g, '')
    .trim();
}

export function remarkUseSiteMermaidTheme() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'code' && node.lang?.toLowerCase() === 'mermaid') {
        node.value = normalizeMermaidSource(node.value);
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}

import React from 'react';

const TOKEN_RE =
  /(\/\/.*$|#.*$|--.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|import|export|from|async|await|if|else|for|while|type|interface|class|def|SELECT|FROM|WHERE|GROUP|ORDER|BY|LIMIT|AND|OR|AS|JOIN|ON|true|false|null|undefined|None|True|False)\b|\b(\d+(?:\.\d+)?)\b/gm;

export function highlightLine(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(line.slice(lastIdx, match.index));
    }
    const [full, comment, str, kw, num] = match;
    const cls = comment
      ? 'lumina-tok-comment'
      : str
        ? 'lumina-tok-string'
        : kw
          ? 'lumina-tok-keyword'
          : num
            ? 'lumina-tok-number'
            : undefined;
    nodes.push(
      cls ? (
        <span key={k++} className={cls}>
          {full}
        </span>
      ) : (
        full
      ),
    );
    lastIdx = match.index + full.length;
  }
  if (lastIdx < line.length) {
    nodes.push(line.slice(lastIdx));
  }
  return nodes.length > 0 ? nodes : [' '];
}

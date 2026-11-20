import React from 'react';
import { Check, Code2, Copy } from 'lucide-react';
import { emitLuminaToast } from '../../protocol/index.js';
import {
  invokeAction,
  isCallable,
  readNumber,
  readNumberArray,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import { highlightLine } from './tokenizer.js';

export function CodeBlockRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const code = readString(props.code);
  const language = readString(props.language, 'text');
  const filename = readOptionalString(props.filename);
  const showLineNumbers = props.showLineNumbers !== false;
  const highlightSet = new Set<number>(readNumberArray(props.highlightLines));
  const maxHeight = readNumber(props.maxHeight, 420);
  const [copied, setCopied] = React.useState(false);

  const lines = code.replace(/\n$/, '').split('\n');

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    emitLuminaToast('Code copied');
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="lumina-codeblock" style={weightStyle(props.weight)}>
      <div className="lumina-codeblock-header">
        <div className="lumina-codeblock-meta">
          <Code2 size={14} className="lumina-muted-icon" />
          <span className="lumina-codeblock-name">{filename ?? language}</span>
          {filename && <span className="lumina-codeblock-lang">{language}</span>}
        </div>
        <div className="lumina-codeblock-actions">
          {isCallable(props.action) && (
            <button
              type="button"
              className="lumina-codeblock-btn is-accent"
              onClick={() => void invokeAction(props.action)}
            >
              {readString(props.actionLabel, 'Run')}
            </button>
          )}
          <button type="button" className="lumina-codeblock-btn" onClick={handleCopy}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className="lumina-codeblock-scroll" style={{ maxHeight }}>
        <pre className="lumina-codeblock-pre">
          <code>
            {lines.map((line, idx) => {
              const lineNo = idx + 1;
              const isHi = highlightSet.has(lineNo);
              return (
                <div
                  key={idx}
                  className={`lumina-code-line ${isHi ? 'is-highlighted' : ''}`.trim()}
                >
                  {showLineNumbers && (
                    <span className="lumina-code-ln lumina-tabular" aria-hidden="true">
                      {lineNo}
                    </span>
                  )}
                  <span className="lumina-code-text">{highlightLine(line)}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

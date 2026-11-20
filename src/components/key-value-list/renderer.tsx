import React from 'react';
import { Check, Copy } from 'lucide-react';
import { emitLuminaToast } from '../../protocol/index.js';
import {
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function KeyValueListRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const layout = props.layout === 'grid' ? 'grid' : 'rows';
  const dividers = props.dividers !== false;
  const items = readRecordArray(props.items);
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const copyVal = (text: string, idx: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedIdx(idx);
    emitLuminaToast(`Copied ${text}`);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  return (
    <div className="lumina-kv-card" style={weightStyle(props.weight)}>
      {title && <div className="lumina-kv-title">{title}</div>}
      <dl
        className={`lumina-kv-list lumina-kv-${layout} ${dividers ? 'has-dividers' : ''}`.trim()}
      >
        {items.map((item, idx) => {
          const val = readString(item.value);
          const label = readString(item.label);
          const tone = readString(item.tone, 'default');
          const mono = readBoolean(item.mono, false);
          const copyable = readBoolean(item.copyable, false);
          const subvalue = readOptionalString(item.subvalue);
          return (
            <div key={idx} className="lumina-kv-item">
              <dt className="lumina-kv-label">{label}</dt>
              <dd className="lumina-kv-val-wrap">
                <span
                  className={`lumina-kv-value lumina-kv-tone-${tone} ${mono ? 'lumina-mono' : ''} lumina-tabular`.trim()}
                >
                  {val}
                </span>
                {copyable && (
                  <button
                    type="button"
                    className="lumina-kv-copy"
                    aria-label={`Copy ${label}`}
                    onClick={() => copyVal(val, idx)}
                  >
                    {copiedIdx === idx ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                )}
                {subvalue && <span className="lumina-kv-subvalue">{subvalue}</span>}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

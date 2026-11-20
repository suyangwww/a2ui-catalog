import React from 'react';
import { motion } from 'motion/react';
import {
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
  safeUrl,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function extractDomain(url: string, explicit?: string): string {
  if (explicit && explicit.trim()) return explicit.trim();
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
}

export function SourceListRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const variant = readString(props.variant, 'cards');
  const sources = readRecordArray(props.sources);

  return (
    <div className="lumina-sources" style={weightStyle(props.weight)}>
      {title && <div className="lumina-section-title">{title}</div>}
      <div className={`lumina-sources-list lumina-sources-${variant}`}>
        {sources.map((src, i) => {
          const url = safeUrl(src.url);
          const domain = extractDomain(url, readOptionalString(src.domain));
          const badgeNum = readOptionalNumber(src.index) ?? i + 1;
          const monogram = domain.slice(0, 1).toUpperCase();
          const snippet = readOptionalString(src.snippet);
          const publishedAt = readOptionalString(src.publishedAt);
          return (
            <motion.a
              key={readString(src.id, String(i))}
              href={url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="lumina-source-item"
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.985 }}
              transition={springTactile}
            >
              <div className="lumina-source-top">
                <span className="lumina-source-monogram" aria-hidden="true">
                  {monogram}
                </span>
                <span className="lumina-source-domain">{domain}</span>
                <span className="lumina-source-index lumina-tabular">{badgeNum}</span>
              </div>
              <div className="lumina-source-title">{readString(src.title)}</div>
              {variant !== 'pills' && snippet && (
                <div className="lumina-source-snippet">{snippet}</div>
              )}
              {variant !== 'pills' && publishedAt && (
                <div className="lumina-source-meta">{publishedAt}</div>
              )}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

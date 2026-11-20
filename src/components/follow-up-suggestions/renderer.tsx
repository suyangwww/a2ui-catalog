import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import {
  LuminaIconGlyph,
  invokeAction,
  readOptionalString,
  readRecordArray,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function FollowUpSuggestionsRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const layout = readString(props.layout, 'wrap');
  const suggestions = readRecordArray(props.suggestions);

  return (
    <div
      className="lumina-followups"
      style={weightStyle(props.weight)}
      role="group"
      aria-label={title ?? 'Suggested follow-ups'}
    >
      {title && <div className="lumina-followups-title">{title}</div>}
      <div className={`lumina-followups-list lumina-followups-${layout}`}>
        {suggestions.map((s, idx) => {
          const icon = readOptionalString(s.icon);
          return (
            <motion.button
              key={idx}
              type="button"
              className="lumina-followup-pill"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => void invokeAction(s.action)}
            >
              {icon ? (
                <LuminaIconGlyph name={icon} size="xs" className="lumina-followup-icon" />
              ) : (
                <Sparkles size={13} className="lumina-followup-icon" />
              )}
              <span>{readString(s.label)}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

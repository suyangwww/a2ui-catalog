import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Check, SkipForward } from 'lucide-react';
import {
  LuminaIconGlyph,
  readOptionalString,
  readRecordArray,
  readString,
  renderChildRef,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function StepTimelineRenderer({
  props,
  buildChild,
}: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const steps = readRecordArray(props.steps);

  return (
    <div className="lumina-timeline" style={weightStyle(props.weight)}>
      {title && <div className="lumina-section-title">{title}</div>}
      <ol className="lumina-timeline-list">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const status = readString(step.status, 'pending');
          const icon = readOptionalString(step.icon);
          const timestamp = readOptionalString(step.timestamp);
          const subtitle = readOptionalString(step.subtitle);
          return (
            <motion.li
              key={readString(step.id, String(idx))}
              className={`lumina-timeline-item lumina-step-${status}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.24) }}
            >
              <div className="lumina-timeline-rail" aria-hidden="true">
                <span className={`lumina-timeline-node lumina-node-${status}`}>
                  {status === 'completed' ? (
                    <Check size={12} strokeWidth={3} />
                  ) : status === 'error' ? (
                    <AlertCircle size={12} strokeWidth={2.5} />
                  ) : status === 'skipped' ? (
                    <SkipForward size={11} />
                  ) : icon ? (
                    <LuminaIconGlyph name={icon} size="xs" />
                  ) : (
                    <span className="lumina-node-dot" />
                  )}
                </span>
                {!isLast && <span className="lumina-timeline-line" />}
              </div>
              <div className="lumina-timeline-content">
                <div className="lumina-timeline-head">
                  <span className="lumina-timeline-title">{readString(step.title)}</span>
                  {timestamp && (
                    <span className="lumina-timeline-time lumina-tabular">{timestamp}</span>
                  )}
                </div>
                {subtitle && <div className="lumina-timeline-subtitle">{subtitle}</div>}
                {Boolean(step.child) && (
                  <div className="lumina-timeline-child">
                    {renderChildRef(buildChild, step.child)}
                  </div>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

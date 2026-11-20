import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';
import {
  readBoolean,
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
  renderChildRef,
  springFluid,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ThoughtTraceRenderer({
  props,
  buildChild,
}: LuminaReactRenderArgs): React.ReactNode {
  const [expanded, setExpanded] = React.useState(readBoolean(props.defaultExpanded, false));
  const status = props.status === 'thinking' ? 'thinking' : 'complete';
  const summary = readString(props.summary, 'Reasoning');
  const durNum = readOptionalNumber(props.durationSeconds);
  const duration = durNum !== undefined ? `${durNum.toFixed(1)}s` : null;
  const steps = readRecordArray(props.steps);
  const hasDetails = steps.length > 0 || Boolean(props.child);

  return (
    <div
      className={`lumina-thought lumina-thought-${status}`}
      style={weightStyle(props.weight)}
    >
      <button
        type="button"
        className="lumina-thought-trigger"
        aria-expanded={expanded}
        disabled={!hasDetails}
        onClick={() => {
          if (hasDetails) setExpanded((prev) => !prev);
        }}
      >
        <span
          className={`lumina-thought-icon ${status === 'thinking' ? 'is-pulsing' : ''}`.trim()}
        >
          <Sparkles size={15} strokeWidth={2} />
        </span>
        <span
          className={`lumina-thought-summary ${status === 'thinking' ? 'is-shimmer' : ''}`.trim()}
        >
          {summary}
        </span>
        {duration && <span className="lumina-thought-duration lumina-tabular">{duration}</span>}
        {hasDetails && (
          <ChevronDown
            size={15}
            className={`lumina-thought-chevron ${expanded ? 'is-open' : ''}`.trim()}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {expanded && hasDetails && (
          <motion.div
            className="lumina-thought-body-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springFluid}
          >
            <div className="lumina-thought-body">
              {steps.length > 0 && (
                <ol className="lumina-thought-steps">
                  {steps.map((step, i) => {
                    const detail = readOptionalString(step.detail);
                    return (
                      <li key={i} className="lumina-thought-step">
                        <div className="lumina-thought-step-title">{readString(step.title)}</div>
                        {detail && <div className="lumina-thought-step-detail">{detail}</div>}
                      </li>
                    );
                  })}
                </ol>
              )}
              {Boolean(props.child) && (
                <div className="lumina-thought-child">
                  {renderChildRef(buildChild, props.child)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

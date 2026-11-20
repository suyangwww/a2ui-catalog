import React from 'react';
import { motion } from 'motion/react';
import {
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ProgressIndicatorRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const label = readString(props.label);
  const sublabel = readOptionalString(props.sublabel);
  const variant = readString(props.variant, 'bar');
  const tone = readString(props.tone, 'accent');
  const rawValue = readOptionalNumber(props.value);
  const pct = rawValue !== undefined ? Math.max(0, Math.min(100, rawValue)) : undefined;

  if (variant === 'ring') {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const offset = pct !== undefined ? circ - (pct / 100) * circ : circ * 0.72;
    return (
      <div
        className={`lumina-progress lumina-progress-ring-row lumina-progress-${tone}`}
        style={weightStyle(props.weight)}
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <svg
          width={54}
          height={54}
          viewBox="0 0 54 54"
          className={pct === undefined ? 'lumina-ring-spin' : undefined}
        >
          <circle cx={27} cy={27} r={r} className="lumina-ring-track" />
          <motion.circle
            cx={27}
            cy={27}
            r={r}
            className="lumina-ring-fill"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="lumina-progress-meta">
          <div className="lumina-progress-label">
            <span>{label}</span>
            {pct !== undefined && <span className="lumina-tabular">{Math.round(pct)}%</span>}
          </div>
          {sublabel && <div className="lumina-progress-sublabel">{sublabel}</div>}
        </div>
      </div>
    );
  }

  if (variant === 'segmented') {
    const segments = Math.max(2, Math.min(12, readNumber(props.segments, 4)));
    const filledCount = pct !== undefined ? Math.round((pct / 100) * segments) : 1;
    return (
      <div
        className={`lumina-progress lumina-progress-${tone}`}
        style={weightStyle(props.weight)}
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="lumina-progress-header">
          <span className="lumina-progress-label">{label}</span>
          {pct !== undefined && (
            <span className="lumina-progress-pct lumina-tabular">{Math.round(pct)}%</span>
          )}
        </div>
        <div className="lumina-progress-segments">
          {Array.from({ length: segments }).map((_, i) => (
            <span
              key={i}
              className={`lumina-progress-seg ${i < filledCount ? 'is-filled' : ''}`.trim()}
            />
          ))}
        </div>
        {sublabel && <div className="lumina-progress-sublabel">{sublabel}</div>}
      </div>
    );
  }

  return (
    <div
      className={`lumina-progress lumina-progress-${tone}`}
      style={weightStyle(props.weight)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="lumina-progress-header">
        <span className="lumina-progress-label">{label}</span>
        {pct !== undefined && (
          <span className="lumina-progress-pct lumina-tabular">{Math.round(pct)}%</span>
        )}
      </div>
      <div className="lumina-progress-track">
        {pct !== undefined ? (
          <motion.div
            className="lumina-progress-fill"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div className="lumina-progress-indeterminate" />
        )}
      </div>
      {sublabel && <div className="lumina-progress-sublabel">{sublabel}</div>}
    </div>
  );
}

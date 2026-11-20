import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import {
  AnimatedMetricValue,
  readNumberArray,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function SparklineSvg({ points, sentiment }: { points: number[]; sentiment: string }) {
  const gradId = React.useId();
  if (points.length < 2) return null;
  const w = 140;
  const h = 36;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - 4 - ((p - min) / span) * (h - 8),
  }));
  const lineD = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');
  const areaD = `${lineD} L ${w} ${h} L 0 ${h} Z`;
  const strokeColor =
    sentiment === 'positive'
      ? 'var(--lumina-tone-success)'
      : sentiment === 'negative'
        ? 'var(--lumina-tone-critical)'
        : 'var(--lumina-accent-primary)';

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="lumina-sparkline"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <motion.path
        d={lineD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
    </svg>
  );
}

export function StatMetricRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const label = readString(props.label);
  const value = readString(props.value);
  const delta = readOptionalString(props.delta);
  const trend = readOptionalString(props.trend);
  const sentiment =
    readOptionalString(props.trendSentiment) ??
    (trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'neutral');
  const caption = readOptionalString(props.caption);
  const spark = readNumberArray(props.sparkline);

  return (
    <div className="lumina-stat" style={weightStyle(props.weight)}>
      <div className="lumina-stat-label">{label}</div>
      <div className="lumina-stat-value-row">
        <div className="lumina-stat-value">
          <AnimatedMetricValue value={value} />
        </div>
        {delta && (
          <span className={`lumina-stat-delta is-${sentiment} lumina-tabular`}>
            {trend === 'up' && <ArrowUpRight size={13} />}
            {trend === 'down' && <ArrowDownRight size={13} />}
            {trend === 'flat' && <Minus size={12} />}
            <span>{delta}</span>
          </span>
        )}
      </div>
      {spark.length >= 2 && <SparklineSvg points={spark} sentiment={sentiment} />}
      {caption && <div className="lumina-stat-caption">{caption}</div>}
    </div>
  );
}

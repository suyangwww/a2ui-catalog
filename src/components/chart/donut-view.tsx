import React from 'react';
import { motion } from 'motion/react';
import { readNumber, readString } from '../../primitives/index.js';

const CHART_COLOR_VAR: Readonly<Record<string, string>> = {
  blue: 'var(--lumina-chart-blue)',
  indigo: 'var(--lumina-chart-indigo)',
  emerald: 'var(--lumina-chart-emerald)',
  amber: 'var(--lumina-chart-amber)',
  rose: 'var(--lumina-chart-rose)',
  cyan: 'var(--lumina-chart-cyan)',
  slate: 'var(--lumina-chart-slate)',
};

const DEFAULT_SERIES_COLORS = [
  'blue',
  'emerald',
  'indigo',
  'amber',
  'rose',
  'cyan',
  'slate',
] as const;

export function resolveSeriesColor(colorKey: string | undefined, idx: number): string {
  const fallback = DEFAULT_SERIES_COLORS[idx % DEFAULT_SERIES_COLORS.length] ?? 'blue';
  const key = colorKey ?? fallback;
  return CHART_COLOR_VAR[key] ?? 'var(--lumina-chart-blue)';
}

export function DonutChartView({
  rawData,
  seriesKey,
  xKey,
  title,
  subtitle,
  weightStyleObj,
  activeIdx,
  setActiveIdx,
  fmtVal,
}: {
  rawData: Array<Record<string, unknown>>;
  seriesKey: string;
  xKey: string;
  title?: string | undefined;
  subtitle?: string | undefined;
  weightStyleObj?: { flex: string; minWidth: number } | undefined;
  activeIdx: number | null;
  setActiveIdx: (idx: number | null) => void;
  fmtVal: (val: number) => string;
}): React.ReactNode {
  const total =
    rawData.reduce((acc, d) => acc + Math.max(0, readNumber(d[seriesKey], 0)), 0) || 1;
  const r = 68;
  const cx = 92;
  const cy = 92;
  const circ = 2 * Math.PI * r;
  let accum = 0;
  const hovered = activeIdx !== null ? rawData[activeIdx] : undefined;

  return (
    <div className="lumina-chart-card" style={weightStyleObj}>
      {(title || subtitle) && (
        <div className="lumina-chart-header">
          <div>
            {title && <div className="lumina-card-title">{title}</div>}
            {subtitle && <div className="lumina-card-subtitle">{subtitle}</div>}
          </div>
        </div>
      )}
      <div className="lumina-donut-layout">
        <div className="lumina-donut-svg-wrap">
          <svg viewBox="0 0 184 184" width={184} height={184}>
            {rawData.map((d, i) => {
              const v = Math.max(0, readNumber(d[seriesKey], 0));
              const frac = v / total;
              const dash = frac * circ;
              const offset = -accum * circ;
              accum += frac;
              const stroke = resolveSeriesColor(undefined, i);
              const isActive = activeIdx === i;
              return (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isActive ? 24 : 20}
                  strokeDasharray={`${Math.max(0, dash - 2)} ${circ}`}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ cursor: 'pointer', transition: 'stroke-width 150ms ease' }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                />
              );
            })}
          </svg>
          <div className="lumina-donut-center">
            <div className="lumina-donut-center-val lumina-tabular">
              {hovered ? fmtVal(readNumber(hovered[seriesKey], 0)) : fmtVal(total)}
            </div>
            <div className="lumina-donut-center-lbl">
              {hovered ? readString(hovered[xKey]) : 'Total'}
            </div>
          </div>
        </div>
        <div className="lumina-donut-legend">
          {rawData.map((d, i) => {
            const v = Math.max(0, readNumber(d[seriesKey], 0));
            const pct = Math.round((v / total) * 100);
            const swatch = resolveSeriesColor(undefined, i);
            return (
              <button
                key={i}
                type="button"
                className={`lumina-donut-legend-row ${activeIdx === i ? 'is-active' : ''}`.trim()}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
              >
                <span className="lumina-legend-swatch" style={{ background: swatch }} />
                <span className="lumina-donut-legend-name">{readString(d[xKey])}</span>
                <span className="lumina-donut-legend-val lumina-tabular">
                  {fmtVal(v)} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  AnimatedMetricValue,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

const COLOR_MAP: Readonly<Record<string, string>> = {
  blue: '#4F91CA',
  emerald: '#3A9B74',
  violet: '#7C6EE6',
  amber: '#D98B2B',
  rose: '#DE5B7B',
  cyan: '#2BA3B8',
  slate: '#6E7685',
};

const FALLBACK_COLORS = ['#4F91CA', '#3A9B74', '#7C6EE6', '#D98B2B', '#DE5B7B', '#2BA3B8'];

export function ProportionBarRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const variant = readString(props.variant, 'split');
  const rawSegments = readRecordArray(props.segments);
  const prefix = readString(props.unitPrefix, '');
  const suffix = readString(props.unitSuffix, '');
  const decimals = readOptionalNumber(props.decimals) ?? 0;
  const negativeNote = readOptionalString(props.negativeNote);

  const parsed = rawSegments.map((seg, idx) => {
    const id = readString(seg.id, `seg-${idx}`);
    const label = readString(seg.label, id);
    const val = readNumber(seg.value, 0);
    const colorKey = readOptionalString(seg.color);
    const hex =
      (colorKey ? COLOR_MAP[colorKey] : undefined) ??
      FALLBACK_COLORS[idx % FALLBACK_COLORS.length] ??
      '#4F91CA';
    const explicitFmt = readOptionalString(seg.formattedValue);
    const absNum = Math.abs(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const autoFmt = `${val < 0 ? '-' : ''}${prefix}${absNum}${suffix}`;
    return { id, label, value: val, displayValue: explicitFmt ?? autoFmt, hex };
  });

  const positiveSum = parsed.reduce((acc, s) => acc + Math.max(0, s.value), 0);
  const hasNegative = parsed.some((s) => s.value < 0);
  const activeCount = parsed.filter((s) => s.value > 0).length;
  const ariaSummary = parsed.map((s) => `${s.label}: ${s.displayValue}`).join('. ');

  return (
    <div
      className={`lumina-proportion-bar is-${variant}`}
      style={weightStyle(props.weight)}
    >
      {(title || subtitle) && (
        <div className="lumina-proportion-header">
          {title && <div className="lumina-proportion-title">{title}</div>}
          {subtitle && <div className="lumina-proportion-subtitle">{subtitle}</div>}
        </div>
      )}

      <div
        className={`lumina-proportion-track ${activeCount <= 1 ? 'is-single' : ''}`.trim()}
        role="img"
        aria-label={ariaSummary}
      >
        {positiveSum > 0 &&
          parsed.map((seg) => {
            if (seg.value <= 0) return null;
            const share = (seg.value / positiveSum) * 100;
            return (
              <div
                key={seg.id}
                className="lumina-proportion-segment"
                style={{ width: `${share}%`, backgroundColor: seg.hex }}
              >
                {variant === 'inlineLabels' && share >= 13 && (
                  <span className="lumina-proportion-inline-label lumina-tabular">
                    {seg.displayValue}
                  </span>
                )}
              </div>
            );
          })}
      </div>

      {variant === 'split' && parsed.length === 2 ? (
        <div className="lumina-proportion-split-legend">
          {parsed.map((seg, idx) => (
            <div
              key={seg.id}
              className={`lumina-proportion-stat ${idx === 1 ? 'is-end' : ''}`.trim()}
            >
              <div className="lumina-proportion-label-row">
                <span
                  className="lumina-proportion-swatch"
                  style={{ backgroundColor: seg.hex }}
                  aria-hidden="true"
                />
                <span>{seg.label}</span>
              </div>
              <div className="lumina-proportion-stat-value">
                <AnimatedMetricValue value={seg.displayValue} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lumina-proportion-grid-legend">
          {parsed.map((seg) => (
            <div key={seg.id} className="lumina-proportion-grid-item">
              <span
                className="lumina-proportion-swatch is-dot"
                style={{ backgroundColor: seg.hex }}
                aria-hidden="true"
              />
              <span className="lumina-proportion-grid-name">{seg.label}</span>
              <span className="lumina-proportion-grid-val">
                <AnimatedMetricValue value={seg.displayValue} />
              </span>
            </div>
          ))}
        </div>
      )}

      {hasNegative && negativeNote && (
        <p className="lumina-proportion-negative-note" role="status">
          {negativeNote}
        </p>
      )}
    </div>
  );
}

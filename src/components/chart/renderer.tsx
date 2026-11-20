import React from 'react';
import { motion } from 'motion/react';
import {
  readNumber,
  readOptionalString,
  readRecordArray,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import { DonutChartView, resolveSeriesColor } from './donut-view.js';

export function ChartRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const gradPrefix = React.useId();
  const type = readString(props.type, 'area');
  const rawData = readRecordArray(props.data);
  const xKey = readString(props.xKey, 'label');
  const series = readRecordArray(props.series);
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const valuePrefix = readString(props.valuePrefix);
  const valueSuffix = readString(props.valueSuffix);
  const height = readNumber(props.height, 240);
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  const fmtVal = (v: number) => {
    const formatted =
      Math.abs(v) >= 1000
        ? v.toLocaleString('en-US', { maximumFractionDigits: 1 })
        : Number.isInteger(v)
          ? String(v)
          : v.toFixed(1);
    return `${valuePrefix}${formatted}${valueSuffix}`;
  };

  const maxVal = React.useMemo(() => {
    let m = 0;
    for (const row of rawData) {
      if (type === 'stackedBar') {
        const sum = series.reduce(
          (acc, s) => acc + Math.max(0, readNumber(row[readString(s.key)], 0)),
          0,
        );
        if (sum > m) m = sum;
      } else {
        for (const s of series) {
          const v = readNumber(row[readString(s.key)], 0);
          if (v > m) m = v;
        }
      }
    }
    return m > 0 ? m * 1.12 : 100;
  }, [rawData, series, type]);

  if (rawData.length === 0 || series.length === 0) {
    return (
      <div className="lumina-chart-card" style={weightStyle(props.weight)}>
        {title && <div className="lumina-card-title">{title}</div>}
        <div className="lumina-empty-note">No chart data available</div>
      </div>
    );
  }

  if (type === 'donut') {
    const firstKey = readString(series[0]?.key);
    return (
      <DonutChartView
        rawData={rawData}
        seriesKey={firstKey}
        xKey={xKey}
        title={title}
        subtitle={subtitle}
        weightStyleObj={weightStyle(props.weight)}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        fmtVal={fmtVal}
      />
    );
  }

  const vbW = 600;
  const vbH = Math.max(180, height);
  const padL = 48;
  const padR = 16;
  const padT = 18;
  const padB = 30;
  const plotW = vbW - padL - padR;
  const plotH = vbH - padT - padB;

  const xPos = (i: number) =>
    rawData.length === 1 ? padL + plotW / 2 : padL + (i / (rawData.length - 1)) * plotW;
  const yPos = (v: number) => padT + plotH - (Math.max(0, v) / maxVal) * plotH;

  const handlePointer = (clientX: number, rect: DOMRect) => {
    const relX = ((clientX - rect.left) / rect.width) * vbW;
    const norm = Math.max(0, Math.min(1, (relX - padL) / plotW));
    const idx = Math.round(norm * (rawData.length - 1));
    setActiveIdx(idx);
  };

  const inspectIdx = activeIdx ?? rawData.length - 1;
  const activeRow = rawData[inspectIdx];

  return (
    <div className="lumina-chart-card" style={weightStyle(props.weight)}>
      <div className="lumina-chart-header">
        <div>
          {title && <div className="lumina-card-title">{title}</div>}
          {subtitle && <div className="lumina-card-subtitle">{subtitle}</div>}
        </div>
        {activeRow && (
          <div className="lumina-chart-readout lumina-tabular">
            <span className="lumina-chart-readout-x">{readString(activeRow[xKey])}</span>
            {series.map((s, si) => {
              const sKey = readString(s.key);
              const color = resolveSeriesColor(readOptionalString(s.color), si);
              return (
                <span key={sKey} className="lumina-chart-readout-val">
                  <span className="lumina-legend-swatch" style={{ background: color }} />
                  <span>{fmtVal(readNumber(activeRow[sKey], 0))}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="lumina-chart-canvas"
        onMouseMove={(e) => handlePointer(e.clientX, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => setActiveIdx(null)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) {
            handlePointer(touch.clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
        onTouchEnd={() => setActiveIdx(null)}
      >
        <svg viewBox={`0 0 ${vbW} ${vbH}`} className="lumina-chart-svg">
          <defs>
            {series.map((s, si) => {
              const sKey = readString(s.key);
              const color = resolveSeriesColor(readOptionalString(s.color), si);
              return (
                <linearGradient key={sKey} id={`${gradPrefix}-${si}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.26" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                </linearGradient>
              );
            })}
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((tick, ti) => {
            const y = padT + plotH * (1 - tick);
            const val = maxVal * tick;
            return (
              <g key={ti}>
                <line x1={padL} y1={y} x2={vbW - padR} y2={y} className="lumina-chart-gridline" />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="lumina-chart-axis lumina-tabular"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : Math.round(val)}
                </text>
              </g>
            );
          })}

          {type === 'bar' || type === 'stackedBar'
            ? rawData.map((row, di) => {
                const groupW = Math.min(46, (plotW / rawData.length) * 0.65);
                const centerX = padL + ((di + 0.5) / rawData.length) * plotW;
                let stackTop = padT + plotH;
                return (
                  <g key={di}>
                    {series.map((s, si) => {
                      const sKey = readString(s.key);
                      const color = resolveSeriesColor(readOptionalString(s.color), si);
                      const v = Math.max(0, readNumber(row[sKey], 0));
                      const barH = (v / maxVal) * plotH;
                      if (type === 'stackedBar') {
                        const y = stackTop - barH;
                        stackTop = y;
                        return (
                          <motion.rect
                            key={sKey}
                            x={centerX - groupW / 2}
                            y={y}
                            width={groupW}
                            height={Math.max(1, barH)}
                            rx={4}
                            fill={color}
                            opacity={activeIdx === null || activeIdx === di ? 1 : 0.45}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            style={{ transformOrigin: `${centerX}px ${padT + plotH}px` }}
                            transition={{ duration: 0.45, delay: di * 0.03 }}
                          />
                        );
                      }
                      const singleW = Math.max(6, groupW / series.length - 3);
                      const x = centerX - groupW / 2 + si * (singleW + 3);
                      const y = padT + plotH - barH;
                      return (
                        <motion.rect
                          key={sKey}
                          x={x}
                          y={y}
                          width={singleW}
                          height={Math.max(1, barH)}
                          rx={4}
                          fill={color}
                          opacity={activeIdx === null || activeIdx === di ? 1 : 0.45}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          style={{ transformOrigin: `${x}px ${padT + plotH}px` }}
                          transition={{ duration: 0.45, delay: di * 0.03 }}
                        />
                      );
                    })}
                  </g>
                );
              })
            : series.map((s, si) => {
                const sKey = readString(s.key);
                const color = resolveSeriesColor(readOptionalString(s.color), si);
                const pts = rawData.map((row, di) => ({
                  x: xPos(di),
                  y: yPos(readNumber(row[sKey], 0)),
                }));
                const firstPt = pts[0];
                const lastPt = pts[pts.length - 1];
                if (!firstPt || !lastPt) return null;
                const lineD = pts
                  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                  .join(' ');
                const areaD = `${lineD} L ${lastPt.x.toFixed(1)} ${padT + plotH} L ${firstPt.x.toFixed(1)} ${padT + plotH} Z`;
                const activePt = activeIdx !== null ? pts[activeIdx] : undefined;
                return (
                  <g key={sKey}>
                    {type === 'area' && <path d={areaD} fill={`url(#${gradPrefix}-${si})`} />}
                    <motion.path
                      d={lineD}
                      fill="none"
                      stroke={color}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    />
                    {activePt && (
                      <circle
                        cx={activePt.x}
                        cy={activePt.y}
                        r={4.5}
                        fill="var(--lumina-bg-surface)"
                        stroke={color}
                        strokeWidth={2.5}
                      />
                    )}
                  </g>
                );
              })}

          {activeIdx !== null && type !== 'bar' && type !== 'stackedBar' && (
            <line
              x1={xPos(activeIdx)}
              y1={padT}
              x2={xPos(activeIdx)}
              y2={padT + plotH}
              className="lumina-chart-crosshair"
            />
          )}

          {rawData.map((row, di) => {
            const x =
              type === 'bar' || type === 'stackedBar'
                ? padL + ((di + 0.5) / rawData.length) * plotW
                : xPos(di);
            return (
              <text key={di} x={x} y={vbH - 8} textAnchor="middle" className="lumina-chart-axis">
                {readString(row[xKey])}
              </text>
            );
          })}
        </svg>
      </div>

      {props.showLegend !== false && series.length > 1 && (
        <div className="lumina-chart-legend">
          {series.map((s, si) => {
            const sKey = readString(s.key);
            const color = resolveSeriesColor(readOptionalString(s.color), si);
            return (
              <span key={sKey} className="lumina-chart-legend-item">
                <span className="lumina-legend-swatch" style={{ background: color }} />
                <span>{readString(s.label)}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

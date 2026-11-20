import React from 'react';
import {
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readString,
} from '../../primitives/index.js';

export interface GeoBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface ProjectedStop {
  id: string;
  title: string;
  subtitle?: string | undefined;
  time?: string | undefined;
  category: string;
  detourNote?: string | undefined;
  x: number;
  y: number;
  index: number;
}

export function projectStops(
  bounds: GeoBounds | undefined,
  rawStops: Array<{
    id: string;
    title: string;
    subtitle?: string | undefined;
    time?: string | undefined;
    category: string;
    detourNote?: string | undefined;
    lat: number;
    lng: number;
  }>,
): ProjectedStop[] {
  if (rawStops.length === 0) return [];

  let minLat = bounds?.minLat ?? Infinity;
  let maxLat = bounds?.maxLat ?? -Infinity;
  let minLng = bounds?.minLng ?? Infinity;
  let maxLng = bounds?.maxLng ?? -Infinity;

  if (!bounds) {
    for (const s of rawStops) {
      if (s.lat < minLat) minLat = s.lat;
      if (s.lat > maxLat) maxLat = s.lat;
      if (s.lng < minLng) minLng = s.lng;
      if (s.lng > maxLng) maxLng = s.lng;
    }
    const latPad = Math.max(0.012, (maxLat - minLat) * 0.28);
    const lngPad = Math.max(0.016, (maxLng - minLng) * 0.28);
    minLat -= latPad;
    maxLat += latPad;
    minLng -= lngPad;
    maxLng += lngPad;
  }

  const latSpan = Math.max(0.001, maxLat - minLat);
  const lngSpan = Math.max(0.001, maxLng - minLng);

  return rawStops.map((s, index) => {
    const nx = (s.lng - minLng) / lngSpan;
    const ny = 1 - (s.lat - minLat) / latSpan;
    return {
      ...s,
      x: Math.max(8, Math.min(92, nx * 100)),
      y: Math.max(12, Math.min(88, ny * 100)),
      index,
    };
  });
}

export function buildRoutePath(points: ProjectedStop[], routeStyle: string): string {
  if (points.length === 0) return '';
  const first = points[0];
  if (!first) return '';
  let d = `M ${(first.x * 6.4).toFixed(1)} ${(first.y * 3.4).toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const x1 = prev.x * 6.4;
    const y1 = prev.y * 3.4;
    const x2 = curr.x * 6.4;
    const y2 = curr.y * 3.4;
    if (routeStyle === 'direct') {
      d += ` L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    } else {
      const midX = x1 + (x2 - x1) * 0.56;
      d += ` L ${midX.toFixed(1)} ${y1.toFixed(1)} L ${midX.toFixed(1)} ${y2.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }
  }
  return d;
}

export function BasemapBackdropSvg({
  features,
}: {
  features: ReadonlyArray<Record<string, unknown>>;
}): React.ReactNode {
  if (features.length > 0) {
    return (
      <svg
        viewBox="0 0 640 340"
        preserveAspectRatio="none"
        className="lumina-map-svg-bg"
        aria-hidden="true"
      >
        <rect width="640" height="340" className="lumina-map-land" />
        {features.map((f, idx) => {
          const kind = readString(f.kind, 'land');
          const d = readOptionalString(f.d);
          const r = readOptionalNumber(f.r);
          const w = readOptionalNumber(f.width);
          const h = readOptionalNumber(f.height);
          const cls =
            kind === 'water'
              ? 'lumina-map-water'
              : kind === 'park'
                ? 'lumina-map-park'
                : kind === 'bridge'
                  ? 'lumina-map-bridge'
                  : 'lumina-map-land';

          if (kind === 'label') {
            return (
              <g key={idx} className="lumina-map-neighborhoods">
                <text x={readNumber(f.x)} y={readNumber(f.y)}>
                  {readString(f.text)}
                </text>
              </g>
            );
          }
          if (kind === 'road' || kind === 'bridge') {
            return (
              <g key={idx} className="lumina-map-streets">
                <line
                  x1={readNumber(f.x1)}
                  y1={readNumber(f.y1)}
                  x2={readNumber(f.x2)}
                  y2={readNumber(f.y2)}
                  className={kind === 'bridge' ? 'lumina-map-bridge' : undefined}
                  strokeWidth={readNumber(f.strokeWidth, kind === 'bridge' ? 3.2 : 1.3)}
                />
              </g>
            );
          }
          if (r !== undefined) {
            return <circle key={idx} cx={readNumber(f.x)} cy={readNumber(f.y)} r={r} className={cls} />;
          }
          if (w !== undefined && h !== undefined) {
            return (
              <rect
                key={idx}
                x={readNumber(f.x)}
                y={readNumber(f.y)}
                width={w}
                height={h}
                rx={6}
                className={cls}
              />
            );
          }
          if (d) {
            return <path key={idx} d={d} className={cls} />;
          }
          return null;
        })}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 640 340"
      preserveAspectRatio="none"
      className="lumina-map-svg-bg"
      aria-hidden="true"
    >
      <rect width="640" height="340" className="lumina-map-land" />
      <path d="M 0 0 L 128 0 L 96 146 L 118 250 L 82 340 L 0 340 Z" className="lumina-map-water" />
      <ellipse cx="476" cy="108" rx="92" ry="50" className="lumina-map-park" />
      <ellipse cx="316" cy="256" rx="80" ry="42" className="lumina-map-park" />
      <g className="lumina-map-streets">
        {[68, 136, 204, 272].map((y) => (
          <line key={`gh-${y}`} x1="88" y1={y} x2="640" y2={y} strokeWidth="1.2" />
        ))}
        {[176, 286, 396, 506].map((x) => (
          <line key={`gv-${x}`} x1={x} y1="0" x2={x} y2="340" strokeWidth="1.2" />
        ))}
      </g>
    </svg>
  );
}

import React from 'react';

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
  preset: string,
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

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  if (preset === 'sf-bay') {
    minLat = 37.735;
    maxLat = 37.832;
    minLng = -122.518;
    maxLng = -122.355;
  } else if (preset === 'pnw') {
    minLat = 43.8;
    maxLat = 48.2;
    minLng = -124.8;
    maxLng = -120.8;
  } else {
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

export function buildManhattanRoutePath(points: ProjectedStop[]): string {
  if (points.length === 0) return '';
  const first = points[0];
  if (!first) return '';
  let d = `M ${first.x * 6.4} ${first.y * 3.4}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const x1 = prev.x * 6.4;
    const y1 = prev.y * 3.4;
    const x2 = curr.x * 6.4;
    const y2 = curr.y * 3.4;
    const midX = x1 + (x2 - x1) * 0.56;
    d += ` L ${midX.toFixed(1)} ${y1.toFixed(1)} L ${midX.toFixed(1)} ${y2.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

export function BasemapBackdropSvg({ preset }: { preset: string }): React.ReactNode {
  if (preset === 'sf-bay') {
    return (
      <svg viewBox="0 0 640 340" preserveAspectRatio="none" className="lumina-map-svg-bg" aria-hidden="true">
        {/* Bay & Pacific Water */}
        <rect width="640" height="340" className="lumina-map-water" />
        {/* Marin Headlands North */}
        <path
          d="M 0 0 L 245 0 L 218 42 L 164 56 L 118 44 L 58 64 L 0 54 Z"
          className="lumina-map-land"
        />
        <path d="M 48 0 L 210 0 L 188 38 L 95 40 Z" className="lumina-map-park" />
        {/* Oakland / East Bay */}
        <path d="M 552 0 L 640 0 L 640 270 L 582 225 L 548 135 Z" className="lumina-map-land" />
        {/* SF Peninsula Landmass */}
        <path
          d="M 74 128 L 138 96 L 208 86 L 272 88 L 352 74 L 418 92 L 456 132 L 474 214 L 486 340 L 62 340 L 66 226 Z"
          className="lumina-map-land"
        />
        {/* Presidio & Golden Gate Park & Twin Peaks */}
        <path d="M 135 98 L 228 89 L 236 136 L 146 142 Z" className="lumina-map-park" />
        <rect x="68" y="196" width="168" height="34" rx="6" className="lumina-map-park" />
        <circle cx="268" cy="248" r="22" className="lumina-map-park" />
        {/* Urban Street Grid & Arterials */}
        <g className="lumina-map-streets">
          {[130, 162, 194, 226, 258, 290].map((y) => (
            <line key={`h-${y}`} x1="76" y1={y} x2="462" y2={y} strokeWidth="1.2" />
          ))}
          {[126, 172, 218, 264, 310, 356, 402].map((x) => (
            <line key={`v-${x}`} x1={x} y1="92" x2={x} y2="336" strokeWidth="1.2" />
          ))}
          {/* Market St diagonal + Golden Gate Bridge + Bay Bridge */}
          <line x1="250" y1="262" x2="444" y2="128" strokeWidth="2.8" />
          <line x1="172" y1="52" x2="176" y2="98" className="lumina-map-bridge" strokeWidth="3.5" />
          <line x1="448" y1="126" x2="568" y2="82" className="lumina-map-bridge" strokeWidth="3" />
        </g>
        {/* Subtle neighborhood labels */}
        <g className="lumina-map-neighborhoods">
          <text x="115" y="176">RICHMOND</text>
          <text x="112" y="256">SUNSET</text>
          <text x="355" y="246">MISSION</text>
          <text x="590" y="128">OAKLAND</text>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 640 340" preserveAspectRatio="none" className="lumina-map-svg-bg" aria-hidden="true">
      <rect width="640" height="340" className="lumina-map-land" />
      <path d="M 0 0 L 138 0 L 106 142 L 128 248 L 86 340 L 0 340 Z" className="lumina-map-water" />
      <ellipse cx="470" cy="110" rx="95" ry="52" className="lumina-map-park" />
      <ellipse cx="320" cy="255" rx="84" ry="44" className="lumina-map-park" />
      <g className="lumina-map-streets">
        {[68, 136, 204, 272].map((y) => (
          <line key={`gh-${y}`} x1="96" y1={y} x2="640" y2={y} strokeWidth="1.2" />
        ))}
        {[180, 290, 400, 510].map((x) => (
          <line key={`gv-${x}`} x1={x} y1="0" x2={x} y2="340" strokeWidth="1.2" />
        ))}
      </g>
    </svg>
  );
}

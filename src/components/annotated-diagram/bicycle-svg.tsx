import React from 'react';

interface BicycleSvgProps {
  activeGroup: string;
  gear: number;
}

const SPOKE_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const COGS = [22, 19.5, 17, 15, 13, 11.2, 9.6];

export function BicycleSchematicSvg({ activeGroup, gear }: BicycleSvgProps): React.ReactNode {
  const isAll = activeGroup === 'all' || !activeGroup;
  const op = (group: string) => (isAll || activeGroup === group ? 1 : 0.2);
  const strokeFor = (group: string, base: string, active: string) =>
    !isAll && activeGroup === group ? active : base;

  const clampedGear = Math.max(1, Math.min(7, Math.round(gear)));
  const rearX = 160;
  const rearY = 198;
  const frontX = 478;
  const frontY = 198;
  const bbX = 278;
  const bbY = 204;
  const seatClusterX = 236;
  const seatClusterY = 104;
  const headTopX = 418;
  const headTopY = 98;
  const headBotX = 432;
  const headBotY = 132;

  return (
    <svg
      viewBox="0 0 640 300"
      className="lumina-diagram-svg"
      role="img"
      aria-label="7-speed bicycle technical schematic"
    >
      <defs>
        <radialGradient id="lumina-bike-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="var(--lumina-accent-primary)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--lumina-accent-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow line */}
      <line
        x1="72"
        y1="274"
        x2="568"
        y2="274"
        stroke="var(--lumina-border-hairline)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      {/* WHEELS */}
      <g style={{ opacity: op('wheels'), transition: 'opacity 220ms ease' }}>
        {[
          { cx: rearX, cy: rearY },
          { cx: frontX, cy: frontY },
        ].map((w, idx) => (
          <g key={idx}>
            <circle
              cx={w.cx}
              cy={w.cy}
              r="72"
              fill="none"
              stroke={strokeFor('wheels', 'var(--lumina-fg-primary)', 'var(--lumina-accent-primary)')}
              strokeWidth="7"
            />
            <circle
              cx={w.cx}
              cy={w.cy}
              r="64"
              fill="none"
              stroke="var(--lumina-fg-tertiary)"
              strokeWidth="2"
            />
            {SPOKE_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={w.cx}
                  y1={w.cy}
                  x2={w.cx + Math.cos(rad) * 63}
                  y2={w.cy + Math.sin(rad) * 63}
                  stroke="var(--lumina-fg-tertiary)"
                  strokeWidth="1.1"
                  strokeOpacity="0.55"
                />
              );
            })}
            <circle cx={w.cx} cy={w.cy} r="7" fill="var(--lumina-bg-surface)" stroke="var(--lumina-fg-primary)" strokeWidth="2.5" />
          </g>
        ))}
      </g>

      {/* DRIVETRAIN: 7-speed cassette, chain, chainring, cranks */}
      <g style={{ opacity: op('drivetrain'), transition: 'opacity 220ms ease' }}>
        {COGS.map((r, i) => {
          const isSelectedCog = i + 1 === clampedGear;
          return (
            <circle
              key={r}
              cx={rearX}
              cy={rearY}
              r={r}
              fill="none"
              stroke={isSelectedCog ? '#10A37F' : 'var(--lumina-fg-secondary)'}
              strokeWidth={isSelectedCog ? 2.8 : 1.3}
            />
          );
        })}
        {/* Upper & lower chain runs */}
        <path
          d={`M ${rearX} ${rearY - (COGS[clampedGear - 1] ?? 15)} L ${bbX} ${bbY - 24} A 24 24 0 1 1 ${bbX} ${bbY + 24} L ${rearX} ${rearY + (COGS[clampedGear - 1] ?? 15)}`}
          fill="none"
          stroke={strokeFor('drivetrain', '#10A37F', '#10A37F')}
          strokeWidth="2.4"
          strokeDasharray="5 3"
          className="lumina-bike-chain"
        />
        <circle
          cx={bbX}
          cy={bbY}
          r="24"
          fill="var(--lumina-bg-elevated)"
          fillOpacity="0.65"
          stroke={strokeFor('drivetrain', 'var(--lumina-fg-primary)', '#10A37F')}
          strokeWidth="3"
        />
        {/* Crank arm & pedals */}
        <line x1={bbX - 18} y1={bbY - 26} x2={bbX + 18} y2={bbY + 26} stroke="var(--lumina-fg-primary)" strokeWidth="4" strokeLinecap="round" />
        <rect x={bbX - 27} y={bbY - 30} width="18" height="6" rx="2" fill="var(--lumina-fg-primary)" />
        <rect x={bbX + 9} y={bbY + 24} width="18" height="6" rx="2" fill="var(--lumina-fg-primary)" />
      </g>

      {/* FRAME: Main diamond + rear triangle + front fork */}
      <g style={{ opacity: op('frame'), transition: 'opacity 220ms ease' }}>
        <path
          d={`M ${rearX} ${rearY} L ${seatClusterX} ${seatClusterY} L ${headTopX} ${headTopY} L ${headBotX} ${headBotY} L ${bbX} ${bbY} L ${rearX} ${rearY} M ${seatClusterX} ${seatClusterY} L ${bbX} ${bbY}`}
          fill="none"
          stroke={strokeFor('frame', '#0071E3', '#0071E3')}
          strokeWidth="5.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Front fork */}
        <path
          d={`M ${headBotX} ${headBotY} Q 452 168 ${frontX} ${frontY}`}
          fill="none"
          stroke={strokeFor('frame', '#0071E3', '#0071E3')}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* BRAKES: Rim calipers, cables & brake lever */}
      <g style={{ opacity: op('brakes'), transition: 'opacity 220ms ease' }}>
        {/* Cable along top tube & down fork */}
        <path
          d={`M 412 64 C 446 76, 444 108, 446 142`}
          fill="none"
          stroke="#D97706"
          strokeWidth="2.2"
        />
        <path
          d={`M 410 66 C 362 84, 270 96, 206 138`}
          fill="none"
          stroke="#D97706"
          strokeWidth="2.2"
          strokeDasharray="4 2"
        />
        {/* Caliper pads at front & rear rims */}
        <rect x="441" y="136" width="12" height="12" rx="3" fill="#D97706" />
        <rect x="198" y="134" width="12" height="12" rx="3" fill="#D97706" />
        {/* Hand brake lever */}
        <line x1="414" y1="62" x2="430" y2="74" stroke="#D97706" strokeWidth="3.2" strokeLinecap="round" />
      </g>

      {/* COCKPIT: Stem, swept upright handlebars, seatpost & saddle */}
      <g style={{ opacity: op('cockpit'), transition: 'opacity 220ms ease' }}>
        {/* Seatpost & Saddle */}
        <line
          x1={seatClusterX}
          y1={seatClusterY}
          x2="225"
          y2="74"
          stroke={strokeFor('cockpit', '#5E5CE6', '#5E5CE6')}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 200 72 Q 226 66 252 73 Q 238 81 206 79 Z"
          fill={strokeFor('cockpit', 'var(--lumina-fg-primary)', '#5E5CE6')}
        />
        {/* Stem & Upright Handlebars */}
        <path
          d={`M ${headTopX} ${headTopY} L 408 62 Q 402 54 386 58`}
          fill="none"
          stroke={strokeFor('cockpit', '#5E5CE6', '#5E5CE6')}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <line x1="376" y1="58" x2="396" y2="60" stroke="var(--lumina-fg-primary)" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Gear readout pill in corner */}
      <g transform="translate(20, 18)">
        <rect width="122" height="28" rx="14" fill="var(--lumina-bg-elevated)" stroke="var(--lumina-border-hairline)" />
        <text x="61" y="18" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--lumina-fg-secondary)">
          {`Gear ${clampedGear} of 7 · ${(1.45 + (clampedGear - 1) * 0.32).toFixed(2)}×`}
        </text>
      </g>
    </svg>
  );
}

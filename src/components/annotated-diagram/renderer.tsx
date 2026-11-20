import React from 'react';
import { motion } from 'motion/react';
import {
  invokeSetter,
  isCallable,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import { BicycleSchematicSvg } from './bicycle-svg.js';

export function AnnotatedDiagramRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const pillLayoutId = React.useId();
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const preset = readString(props.preset, 'custom');
  const groups = readRecordArray(props.groups);
  const hotspots = readRecordArray(props.hotspots);
  const shapes = readRecordArray(props.shapes);
  const gear = readNumber(props.activeStep, 4);
  const cadence = readOptionalNumber(props.cadence);

  const propGroup = readString(props.value, 'all');
  const [localGroup, setLocalGroup] = React.useState(propGroup);
  React.useEffect(() => {
    setLocalGroup(propGroup);
  }, [propGroup]);

  const activeGroup = isCallable(props.setValue) ? propGroup : localGroup;

  const selectGroup = (next: string) => {
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, next);
    } else {
      setLocalGroup(next);
    }
  };

  const visibleHotspots =
    activeGroup === 'all'
      ? hotspots
      : hotspots.filter(
          (h) => readString(h.group, readString(h.id)) === activeGroup || readString(h.id) === activeGroup,
        );

  return (
    <section
      className="lumina-annotated-diagram"
      style={weightStyle(props.weight)}
      aria-label={title ?? 'Interactive diagram'}
    >
      {(title || subtitle || groups.length > 0) && (
        <header className="lumina-diagram-header">
          {(title || subtitle) && (
            <div className="lumina-diagram-titles">
              {title && <h3 className="lumina-diagram-title">{title}</h3>}
              {subtitle && <p className="lumina-diagram-subtitle">{subtitle}</p>}
            </div>
          )}
          {groups.length > 0 && (
            <div className="lumina-diagram-pills" role="tablist" aria-label="Subsystem filter">
              {groups.map((grp) => {
                const gid = readString(grp.id);
                const glabel = readString(grp.label, gid);
                const isActive = activeGroup === gid;
                return (
                  <button
                    key={gid}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`lumina-diagram-pill ${isActive ? 'is-active' : ''}`.trim()}
                    onClick={() => selectGroup(gid)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`diag-pill-${pillLayoutId}`}
                        className="lumina-diagram-pill-bg"
                        transition={springTactile}
                      />
                    )}
                    <span className="lumina-diagram-pill-text">{glabel}</span>
                  </button>
                );
              })}
            </div>
          )}
        </header>
      )}

      <div className="lumina-diagram-stage">
        {preset === 'bicycle-7speed' ? (
          <BicycleSchematicSvg activeGroup={activeGroup} gear={gear} />
        ) : (
          <svg viewBox="0 0 640 280" className="lumina-diagram-svg" role="img" aria-label={title ?? 'Schematic'}>
            {shapes.map((sh, idx) => {
              const kind = readString(sh.kind);
              const sGroup = readOptionalString(sh.group);
              const dimmed = activeGroup !== 'all' && sGroup && sGroup !== activeGroup;
              const stroke = readString(sh.stroke, 'var(--lumina-accent-primary)');
              const fill = readString(sh.fill, 'var(--lumina-bg-elevated)');
              const opacity = dimmed ? 0.22 : 1;
              if (kind === 'line') {
                return (
                  <line
                    key={idx}
                    x1={readNumber(sh.x1)}
                    y1={readNumber(sh.y1)}
                    x2={readNumber(sh.x2)}
                    y2={readNumber(sh.y2)}
                    stroke={stroke}
                    strokeWidth="3"
                    opacity={opacity}
                  />
                );
              }
              if (kind === 'circle') {
                return (
                  <circle
                    key={idx}
                    cx={readNumber(sh.cx)}
                    cy={readNumber(sh.cy)}
                    r={readNumber(sh.r, 24)}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2.5"
                    opacity={opacity}
                  />
                );
              }
              if (kind === 'rect') {
                return (
                  <rect
                    key={idx}
                    x={readNumber(sh.x)}
                    y={readNumber(sh.y)}
                    width={readNumber(sh.width, 120)}
                    height={readNumber(sh.height, 64)}
                    rx="12"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2"
                    opacity={opacity}
                  />
                );
              }
              return (
                <path
                  key={idx}
                  d={readString(sh.d)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="3"
                  opacity={opacity}
                />
              );
            })}
          </svg>
        )}

        {hotspots.map((hs, idx) => {
          const hid = readString(hs.id, `hs-${idx}`);
          const hGroup = readString(hs.group, hid);
          const x = readNumber(hs.x, 50);
          const y = readNumber(hs.y, 50);
          const isSelected = activeGroup === hGroup || activeGroup === hid;
          const isMuted = activeGroup !== 'all' && !isSelected;
          return (
            <button
              key={hid}
              type="button"
              className={`lumina-diagram-pin ${isSelected ? 'is-selected' : ''} ${isMuted ? 'is-muted' : ''}`.trim()}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={readString(hs.label)}
              aria-pressed={isSelected}
              onClick={() => selectGroup(isSelected ? 'all' : hGroup)}
            >
              <span className="lumina-diagram-pin-core">{idx + 1}</span>
            </button>
          );
        })}

        {cadence !== undefined && (
          <div className="lumina-diagram-cadence lumina-tabular">{cadence} RPM</div>
        )}
      </div>

      <div className="lumina-diagram-cards">
        {(visibleHotspots.length > 0 ? visibleHotspots : hotspots).map((hs, idx) => {
          const hid = readString(hs.id, `card-${idx}`);
          const hGroup = readString(hs.group, hid);
          const badge = readOptionalString(hs.badge);
          const isSelected = activeGroup === hGroup || activeGroup === hid;
          return (
            <button
              key={hid}
              type="button"
              className={`lumina-diagram-card ${isSelected ? 'is-selected' : ''}`.trim()}
              onClick={() => selectGroup(isSelected ? 'all' : hGroup)}
            >
              <div className="lumina-diagram-card-top">
                <span className="lumina-diagram-card-title">{readString(hs.label)}</span>
                {badge && <span className="lumina-diagram-card-badge">{badge}</span>}
              </div>
              <p className="lumina-diagram-card-detail">{readString(hs.detail)}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

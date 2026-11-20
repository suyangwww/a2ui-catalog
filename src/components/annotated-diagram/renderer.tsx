import React from 'react';
import { motion } from 'motion/react';
import {
  invokeSetter,
  isCallable,
  readBoolean,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function AnnotatedDiagramRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const pillLayoutId = React.useId();
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const viewBox = readString(props.viewBox, '0 0 640 280');
  const statusBadge = readOptionalString(props.statusBadge);
  const groups = readRecordArray(props.groups);
  const hotspots = readRecordArray(props.hotspots);
  const shapes = readRecordArray(props.shapes);
  const activeStep = readOptionalNumber(props.activeStep);

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
          (h) =>
            readString(h.group, readString(h.id)) === activeGroup ||
            readString(h.id) === activeGroup,
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
        <svg
          viewBox={viewBox}
          className="lumina-diagram-svg"
          role="img"
          aria-label={title ?? 'Schematic'}
        >
          {shapes.map((sh, idx) => {
            const kind = readString(sh.kind);
            const sGroup = readOptionalString(sh.group);
            const sStep = readOptionalNumber(sh.step);
            const isGroupHighlighted = activeGroup !== 'all' && sGroup === activeGroup;
            const isStepHighlighted =
              activeStep !== undefined && sStep !== undefined && Math.round(activeStep) === sStep;
            const dimmed = Boolean(activeGroup !== 'all' && sGroup && sGroup !== activeGroup);
            const baseStroke = readString(sh.stroke, 'var(--lumina-accent-primary)');
            const stroke =
              isGroupHighlighted || isStepHighlighted
                ? readString(sh.activeStroke, isStepHighlighted ? '#10A37F' : baseStroke)
                : baseStroke;
            const baseWidth = readNumber(sh.strokeWidth, kind === 'rect' ? 2 : 2.8);
            const strokeWidth = isStepHighlighted ? baseWidth + 1.4 : baseWidth;
            const dash = readOptionalString(sh.strokeDasharray);
            const fill = readString(sh.fill, kind === 'rect' ? 'var(--lumina-bg-elevated)' : 'none');
            const fillOpacity = readOptionalNumber(sh.fillOpacity);
            const flowClass = readBoolean(sh.animatedFlow, false) ? 'lumina-diagram-flow' : undefined;
            const styleObj = { opacity: dimmed ? 0.2 : 1, transition: 'opacity 220ms ease' };

            if (kind === 'line') {
              return (
                <line
                  key={idx}
                  x1={readNumber(sh.x1)}
                  y1={readNumber(sh.y1)}
                  x2={readNumber(sh.x2)}
                  y2={readNumber(sh.y2)}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dash}
                  strokeLinecap="round"
                  className={flowClass}
                  style={styleObj}
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
                  fillOpacity={fillOpacity}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dash}
                  className={flowClass}
                  style={styleObj}
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
                  rx={readNumber(sh.rx, 10)}
                  fill={fill}
                  fillOpacity={fillOpacity}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dash}
                  className={flowClass}
                  style={styleObj}
                />
              );
            }
            return (
              <path
                key={idx}
                d={readString(sh.d)}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={flowClass}
                style={styleObj}
              />
            );
          })}
        </svg>

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

        {statusBadge && (
          <div className="lumina-diagram-cadence lumina-tabular">{statusBadge}</div>
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

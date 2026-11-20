import React from 'react';
import {
  GAP_VAR,
  StreamingEntrance,
  childRefKey,
  normalizeChildList,
  readNumber,
  readOptionalNumber,
  readString,
  renderChildRef,
  useIsMobileViewport,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function GridRenderer({
  props,
  buildChild,
  accessibilityRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const isMobile = useIsMobileViewport();
  const children = normalizeChildList(props.children);
  const cols = readNumber(props.columns, 2);
  const minW = readOptionalNumber(props.minItemWidth);

  const templateCols = isMobile
    ? 'minmax(0, 1fr)'
    : minW !== undefined
      ? `repeat(auto-fit, minmax(min(100%, ${minW}px), 1fr))`
      : `repeat(${Math.max(1, Math.min(6, cols))}, minmax(0, 1fr))`;

  const style: React.CSSProperties = {
    ...weightStyle(props.weight),
    gridTemplateColumns: templateCols,
    gap: GAP_VAR[readString(props.gap, 'md')] ?? 'var(--lumina-space-md)',
  };

  return (
    <div ref={accessibilityRef} className="lumina-grid" style={style}>
      {children.map((ref, idx) => (
        <StreamingEntrance
          key={childRefKey(ref, idx)}
          delay={Math.min(idx * 0.035, 0.25)}
          className="lumina-grid-cell"
        >
          {renderChildRef(buildChild, ref, idx)}
        </StreamingEntrance>
      ))}
    </div>
  );
}

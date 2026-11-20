import React from 'react';
import {
  ALIGN_MAP,
  GAP_VAR,
  JUSTIFY_MAP,
  normalizeChildList,
  readBoolean,
  readString,
  renderChildRef,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function RowRenderer({
  props,
  buildChild,
  accessibilityRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const children = normalizeChildList(props.children);
  const wrap = readBoolean(props.wrap, false);
  const style: React.CSSProperties = {
    ...weightStyle(props.weight),
    justifyContent: JUSTIFY_MAP[readString(props.justify, 'start')] ?? 'flex-start',
    alignItems: ALIGN_MAP[readString(props.align, 'center')] ?? 'center',
    gap: GAP_VAR[readString(props.gap, 'md')] ?? 'var(--lumina-space-md)',
    ...(wrap ? { flexWrap: 'wrap' } : {}),
  };

  return (
    <div
      ref={accessibilityRef}
      className={`lumina-row ${wrap ? 'lumina-row-wrap' : ''}`.trim()}
      style={style}
    >
      {children.map((ref, idx) => renderChildRef(buildChild, ref, idx))}
    </div>
  );
}

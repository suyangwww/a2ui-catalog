import React from 'react';
import {
  ALIGN_MAP,
  GAP_VAR,
  JUSTIFY_MAP,
  normalizeChildList,
  readString,
  renderChildRef,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ColumnRenderer({
  props,
  buildChild,
  accessibilityRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const children = normalizeChildList(props.children);
  const style: React.CSSProperties = {
    ...weightStyle(props.weight),
    justifyContent: JUSTIFY_MAP[readString(props.justify, 'start')] ?? 'flex-start',
    alignItems: ALIGN_MAP[readString(props.align, 'stretch')] ?? 'stretch',
    gap: GAP_VAR[readString(props.gap, 'md')] ?? 'var(--lumina-space-md)',
  };
  return (
    <div ref={accessibilityRef} className="lumina-column" style={style}>
      {children.map((ref, idx) => renderChildRef(buildChild, ref, idx))}
    </div>
  );
}

import React from 'react';
import {
  ALIGN_MAP,
  GAP_VAR,
  childRefKey,
  normalizeChildList,
  readBoolean,
  readString,
  renderChildRef,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ListRenderer({ props, buildChild }: LuminaReactRenderArgs): React.ReactNode {
  const children = normalizeChildList(props.children);
  const direction = props.direction === 'horizontal' ? 'horizontal' : 'vertical';
  const dividers = readBoolean(props.dividers, false);
  const style: React.CSSProperties = {
    ...weightStyle(props.weight),
    alignItems: ALIGN_MAP[readString(props.align, 'stretch')] ?? 'stretch',
    gap: dividers ? '0px' : (GAP_VAR[readString(props.gap, 'sm')] ?? 'var(--lumina-space-sm)'),
  };

  return (
    <div
      className={`lumina-list lumina-list-${direction} ${dividers ? 'lumina-list-dividers' : ''}`.trim()}
      style={style}
      role="list"
    >
      {children.map((ref, idx) => (
        <div key={childRefKey(ref, idx)} role="listitem" className="lumina-list-item">
          {renderChildRef(buildChild, ref, idx)}
        </div>
      ))}
    </div>
  );
}

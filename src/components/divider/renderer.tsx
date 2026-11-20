import React from 'react';
import {
  readOptionalString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function DividerRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const axis = props.axis === 'vertical' ? 'vertical' : 'horizontal';
  const label = readOptionalString(props.label);

  if (axis === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className="lumina-divider-vertical"
        style={weightStyle(props.weight)}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className="lumina-divider-horizontal"
      style={weightStyle(props.weight)}
    >
      <span className="lumina-divider-line" />
      {label && <span className="lumina-divider-label">{label}</span>}
      {label && <span className="lumina-divider-line" />}
    </div>
  );
}

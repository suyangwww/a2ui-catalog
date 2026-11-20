import React from 'react';
import {
  LuminaIconGlyph,
  readBoolean,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function StatusBadgeRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const label = readString(props.label);
  const tone = readString(props.tone, 'neutral');
  const size = readString(props.size, 'md');
  const pulse = readBoolean(props.pulse, false);
  const icon = readOptionalString(props.icon);

  return (
    <span
      className={`lumina-badge lumina-badge-${tone} lumina-badge-${size}`}
      style={weightStyle(props.weight)}
    >
      {pulse && <span className="lumina-badge-pulse" aria-hidden="true" />}
      {icon && <LuminaIconGlyph name={icon} size="xs" />}
      <span>{label}</span>
    </span>
  );
}

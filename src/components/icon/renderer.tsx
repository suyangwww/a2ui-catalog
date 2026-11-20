import React from 'react';
import {
  LuminaIconGlyph,
  readIconSize,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function IconRenderer({
  props,
  accessibilityRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const size = readIconSize(props.size, 'md');
  const tone = readString(props.tone, 'inherit');
  return (
    <span
      ref={accessibilityRef}
      aria-hidden="true"
      className={`lumina-icon lumina-tone-fg-${tone}`}
      style={weightStyle(props.weight)}
    >
      <LuminaIconGlyph name={props.name} size={size} />
    </span>
  );
}

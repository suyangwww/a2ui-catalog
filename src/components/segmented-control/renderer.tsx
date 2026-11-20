import React from 'react';
import { motion } from 'motion/react';
import {
  LuminaIconGlyph,
  invokeAction,
  invokeSetter,
  readOptionalString,
  readRecordArray,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function SegmentedControlRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const layoutId = React.useId();
  const options = readRecordArray(props.options);
  const fallbackVal = readString(options[0]?.value);
  const current = readString(props.value, fallbackVal);
  const label = readOptionalString(props.label);

  const selectOption = (val: string) => {
    if (val === current) return;
    invokeSetter(props.setValue, val);
    void invokeAction(props.action);
  };

  return (
    <div className="lumina-segmented-wrap" style={weightStyle(props.weight)}>
      {label && <div className="lumina-field-label">{label}</div>}
      <div
        role="radiogroup"
        aria-label={label ?? 'Options'}
        className={`lumina-segmented ${props.fullWidth === false ? 'is-inline' : 'is-full'}`}
      >
        {options.map((opt) => {
          const val = readString(opt.value);
          const active = val === current;
          const icon = readOptionalString(opt.icon);
          return (
            <button
              key={val}
              type="button"
              role="radio"
              aria-checked={active}
              className={`lumina-segment-btn ${active ? 'is-active' : ''}`.trim()}
              onClick={() => selectOption(val)}
            >
              {active && (
                <motion.span
                  layoutId={`seg-thumb-${layoutId}`}
                  className="lumina-segment-thumb"
                  transition={springTactile}
                />
              )}
              <span className="lumina-segment-label">
                {icon && <LuminaIconGlyph name={icon} size="xs" />}
                <span>{readString(opt.label)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

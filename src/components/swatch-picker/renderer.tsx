import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import {
  ValidationErrors,
  invokeSetter,
  isCallable,
  readOptionalString,
  readRecordArray,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  if (full.length !== 6) return false;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.68;
}

export function SwatchPickerRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const label = readOptionalString(props.label);
  const swatches = readRecordArray(props.swatches);
  const fallbackVal = readString(swatches[0]?.value);
  const propVal = readString(props.value, fallbackVal);
  const [localVal, setLocalVal] = React.useState(propVal);

  React.useEffect(() => {
    setLocalVal(propVal);
  }, [propVal]);

  const current = isCallable(props.setValue) ? propVal : localVal;
  const variant = readString(props.variant, 'circle');
  const size = readString(props.size, 'md');

  const selectSwatch = (val: string) => {
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, val);
    } else {
      setLocalVal(val);
    }
  };

  return (
    <div
      ref={accessibilityRef}
      className={`lumina-swatch-picker is-${variant} is-${size}`}
      style={weightStyle(props.weight)}
      role="radiogroup"
      aria-label={label ?? 'Color palette'}
    >
      {label && <div className="lumina-field-label">{label}</div>}
      <div className="lumina-swatch-list">
        {swatches.map((item, idx) => {
          const val = readString(item.value, `swatch-${idx}`);
          const name = readString(item.label, val);
          const hex = readString(item.hex, '#5E6647');
          const subtitle = readOptionalString(item.subtitle);
          const active = val === current;
          const lightFill = isLightHex(hex);

          return (
            <motion.button
              key={val}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={name}
              whileTap={{ scale: 0.94 }}
              transition={springTactile}
              className={`lumina-swatch-btn ${active ? 'is-active' : ''}`.trim()}
              onClick={() => selectSwatch(val)}
            >
              <span
                className={`lumina-swatch-disc ${lightFill ? 'is-light' : ''}`.trim()}
                style={{ backgroundColor: hex }}
              >
                {active && (
                  <Check
                    size={size === 'sm' ? 12 : 15}
                    strokeWidth={2.8}
                    color={lightFill ? '#141417' : '#FFFFFF'}
                  />
                )}
              </span>
              <span className="lumina-swatch-name">{name}</span>
              {subtitle && <span className="lumina-swatch-sub">{subtitle}</span>}
            </motion.button>
          );
        })}
      </div>
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

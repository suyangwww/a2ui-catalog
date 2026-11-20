import React from 'react';
import {
  ValidationErrors,
  invokeSetter,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function SliderRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const id = React.useId();
  const min = readNumber(props.min, 0);
  const max = readNumber(props.max, 100);
  const val = Math.max(min, Math.min(max, readNumber(props.value, min)));
  const steps = readOptionalNumber(props.steps);
  const step = steps !== undefined && steps > 0 ? (max - min) / steps : 1;
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  const label = readOptionalString(props.label);
  const unit = readOptionalString(props.unit);

  return (
    <div className="lumina-slider-field" style={weightStyle(props.weight)}>
      <div className="lumina-slider-header">
        {label ? (
          <label htmlFor={id} className="lumina-field-label">
            {label}
          </label>
        ) : (
          <span />
        )}
        <span className="lumina-slider-readout lumina-tabular">
          {Number.isInteger(val) ? val : val.toFixed(1)}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        id={id}
        ref={accessibilityRef}
        type="range"
        className="lumina-slider"
        min={min}
        max={max}
        step={step}
        value={val}
        style={{ '--pct': `${pct}%` }}
        onChange={(e) => invokeSetter(props.setValue, Number(e.target.value))}
      />
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

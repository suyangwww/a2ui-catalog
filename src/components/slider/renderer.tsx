import React from 'react';
import {
  ValidationErrors,
  invokeSetter,
  isCallable,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
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
  const propVal = Math.max(min, Math.min(max, readNumber(props.value, min)));
  const [localVal, setLocalVal] = React.useState(propVal);
  React.useEffect(() => {
    setLocalVal(propVal);
  }, [propVal]);

  const val = isCallable(props.setValue) ? propVal : localVal;
  const explicitStep = readOptionalNumber(props.step);
  const steps = readOptionalNumber(props.steps);
  const step =
    explicitStep !== undefined && explicitStep > 0
      ? explicitStep
      : steps !== undefined && steps > 0
        ? (max - min) / steps
        : 1;
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  const label = readOptionalString(props.label);
  const prefix = readOptionalString(props.valuePrefix);
  const unit = readOptionalString(props.unit);
  const marks = readRecordArray(props.marks);

  const formattedNum = Number.isInteger(val)
    ? val.toLocaleString('en-US')
    : val.toFixed(step < 1 && String(step).includes('.') ? Math.min(2, String(step).split('.')[1]?.length ?? 1) : 1);
  const suffix = unit ? (unit === '%' ? '%' : ` ${unit}`) : '';

  const handleChange = (next: number) => {
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, next);
    } else {
      setLocalVal(next);
    }
  };

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
        <output htmlFor={id} className="lumina-slider-readout lumina-tabular">
          {prefix ?? ''}
          {formattedNum}
          {suffix}
        </output>
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
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      {marks.length > 0 && (
        <div className="lumina-slider-marks" aria-hidden="true">
          {marks.map((mark, idx) => {
            const mVal = readNumber(mark.value, min);
            const mPct = max > min ? Math.max(0, Math.min(100, ((mVal - min) / (max - min)) * 100)) : 0;
            const alignClass =
              mPct <= 4 ? 'is-start' : mPct >= 96 ? 'is-end' : 'is-mid';
            return (
              <span
                key={`${idx}-${mVal}`}
                className={`lumina-slider-mark ${alignClass}`}
                style={{ left: `${mPct}%` }}
              >
                {readString(mark.label)}
              </span>
            );
          })}
        </div>
      )}
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

import React from 'react';
import {
  ValidationErrors,
  invokeSetter,
  readBoolean,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function DateTimeInputRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const id = React.useId();
  const label = readOptionalString(props.label);
  const enableDate = props.enableDate !== false;
  const enableTime = readBoolean(props.enableTime, false);
  const type = enableDate && enableTime ? 'datetime-local' : enableTime ? 'time' : 'date';
  const rawVal = readString(props.value);
  const normalizedVal =
    type === 'date' && rawVal.length > 10
      ? rawVal.slice(0, 10)
      : type === 'datetime-local' && rawVal.length > 16
        ? rawVal.slice(0, 16)
        : rawVal;

  return (
    <div className="lumina-field" style={weightStyle(props.weight)}>
      {label && (
        <label htmlFor={id} className="lumina-field-label">
          {label}
        </label>
      )}
      <div className="lumina-input-shell">
        <input
          id={id}
          ref={accessibilityRef}
          type={type}
          className="lumina-input lumina-tabular"
          value={normalizedVal}
          min={readOptionalString(props.min)}
          max={readOptionalString(props.max)}
          onChange={(e) => invokeSetter(props.setValue, e.target.value)}
        />
      </div>
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import {
  ValidationErrors,
  invokeAction,
  invokeSetter,
  readBoolean,
  readOptionalString,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function SwitchRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const id = React.useId();
  const checked = Boolean(props.value);
  const disabled = readBoolean(props.disabled, false);
  const label = readString(props.label);
  const description = readOptionalString(props.description);

  const handleToggle = () => {
    if (disabled) return;
    invokeSetter(props.setValue, !checked);
    void invokeAction(props.action);
  };

  return (
    <div className="lumina-switch-field" style={weightStyle(props.weight)}>
      <div className={`lumina-switch-row ${disabled ? 'is-disabled' : ''}`.trim()}>
        <label htmlFor={id} className="lumina-switch-copy" onClick={handleToggle}>
          <span className="lumina-switch-label">{label}</span>
          {description && <span className="lumina-switch-desc">{description}</span>}
        </label>
        <button
          id={id}
          ref={accessibilityRef}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          className={`lumina-switch-track ${checked ? 'is-checked' : ''}`.trim()}
          onClick={handleToggle}
        >
          <motion.span layout className="lumina-switch-thumb" transition={springTactile} />
        </button>
      </div>
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

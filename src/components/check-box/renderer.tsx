import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import {
  ValidationErrors,
  invokeSetter,
  readBoolean,
  readOptionalString,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function CheckBoxRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const id = React.useId();
  const checked = Boolean(props.value);
  const disabled = readBoolean(props.disabled, false);
  const label = readString(props.label);
  const description = readOptionalString(props.description);

  return (
    <div className="lumina-checkbox-field" style={weightStyle(props.weight)}>
      <label
        htmlFor={id}
        className={`lumina-checkbox-row ${disabled ? 'is-disabled' : ''}`.trim()}
      >
        <input
          id={id}
          ref={accessibilityRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="lumina-checkbox-native"
          onChange={(e) => invokeSetter(props.setValue, e.target.checked)}
        />
        <motion.span
          className={`lumina-checkbox-box ${checked ? 'is-checked' : ''}`.trim()}
          {...(!disabled ? { whileTap: { scale: 0.9 } } : {})}
          transition={springTactile}
          aria-hidden="true"
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </motion.span>
        <span className="lumina-checkbox-copy">
          <span className="lumina-checkbox-label">{label}</span>
          {description && <span className="lumina-checkbox-desc">{description}</span>}
        </span>
      </label>
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

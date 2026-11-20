import React from 'react';
import { motion } from 'motion/react';
import {
  LuminaIconGlyph,
  ValidationErrors,
  invokeAction,
  isCallable,
  readBoolean,
  readOptionalString,
  readString,
  renderChildRef,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ButtonRenderer({
  props,
  buildChild,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const variant = readString(props.variant, 'default');
  const size = readString(props.size, 'md');
  const fullWidth = readBoolean(props.fullWidth, false);
  const isValid = props.isValid !== false;
  const disabled = readBoolean(props.disabled, false) || !isValid;
  const icon = readOptionalString(props.icon);
  const trailingIcon = readOptionalString(props.trailingIcon);
  const [busy, setBusy] = React.useState(false);

  const handleClick = async () => {
    if (disabled || !isCallable(props.action)) return;
    try {
      setBusy(true);
      await invokeAction(props.action);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`lumina-button-wrap ${fullWidth ? 'is-full' : ''}`.trim()}
      style={weightStyle(props.weight)}
    >
      <motion.button
        ref={accessibilityRef}
        type="button"
        disabled={disabled}
        aria-invalid={!isValid ? true : undefined}
        className={`lumina-btn lumina-btn-${variant} lumina-btn-${size} ${fullWidth ? 'is-full' : ''}`.trim()}
        {...(!disabled ? { whileTap: { scale: 0.97 } } : {})}
        transition={springTactile}
        onClick={() => void handleClick()}
      >
        {icon && <LuminaIconGlyph name={icon} size="sm" />}
        {props.child ? renderChildRef(buildChild, props.child) : <span>{readString(props.label)}</span>}
        {trailingIcon && <LuminaIconGlyph name={trailingIcon} size="sm" />}
        {busy && <span className="lumina-btn-spinner" aria-hidden="true" />}
      </motion.button>
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

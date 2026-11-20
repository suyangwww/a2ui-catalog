import React from 'react';
import { X } from 'lucide-react';
import {
  LuminaIconGlyph,
  ValidationErrors,
  invokeSetter,
  readBoolean,
  readOptionalString,
  readString,
  readStringArray,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function TextFieldRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const id = React.useId();
  const label = readString(props.label);
  const value = readString(props.value);
  const placeholder = readString(props.placeholder);
  const helperText = readOptionalString(props.helperText);
  const variant = readString(props.variant, 'shortText');
  const prefixIcon = readOptionalString(props.prefixIcon);
  const clearable = readBoolean(props.clearable, false);
  const disabled = readBoolean(props.disabled, false);
  const errors = readStringArray(props.validationErrors);
  const hasErrors = props.isValid === false && errors.length > 0;

  const inputType =
    variant === 'obscured'
      ? 'password'
      : variant === 'number'
        ? 'number'
        : variant === 'email'
          ? 'email'
          : variant === 'search'
            ? 'search'
            : variant === 'url'
              ? 'url'
              : 'text';

  return (
    <div
      className={`lumina-field ${hasErrors ? 'has-error' : ''}`.trim()}
      style={weightStyle(props.weight)}
    >
      {label && (
        <label htmlFor={id} className="lumina-field-label">
          {label}
        </label>
      )}
      <div className="lumina-input-shell">
        {prefixIcon && (
          <span className="lumina-input-prefix">
            <LuminaIconGlyph name={prefixIcon} size="sm" />
          </span>
        )}
        {variant === 'longText' ? (
          <textarea
            id={id}
            ref={accessibilityRef}
            className="lumina-input lumina-textarea"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            onChange={(e) => invokeSetter(props.setValue, e.target.value)}
          />
        ) : (
          <input
            id={id}
            ref={accessibilityRef}
            type={inputType}
            className="lumina-input"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => invokeSetter(props.setValue, e.target.value)}
          />
        )}
        {clearable && value.length > 0 && !disabled && (
          <button
            type="button"
            className="lumina-input-clear"
            aria-label="Clear input"
            onClick={() => invokeSetter(props.setValue, '')}
          >
            <X size={14} />
          </button>
        )}
      </div>
      {helperText && !hasErrors && <div className="lumina-field-helper">{helperText}</div>}
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

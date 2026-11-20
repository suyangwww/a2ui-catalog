import React from 'react';
import { motion } from 'motion/react';
import { Check, Search } from 'lucide-react';
import {
  LuminaIconGlyph,
  ValidationErrors,
  invokeSetter,
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  readStringArray,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ChoicePickerRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const label = readOptionalString(props.label);
  const options = readRecordArray(props.options);
  const selected = readStringArray(props.value);
  const isMulti = props.variant === 'multipleSelection';
  const displayStyle = readString(props.displayStyle, 'chips');
  const filterable = readBoolean(props.filterable, false);
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => readString(o.label).toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (val: string) => {
    if (isMulti) {
      const next = selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val];
      invokeSetter(props.setValue, next);
    } else {
      invokeSetter(props.setValue, [val]);
    }
  };

  return (
    <div
      ref={accessibilityRef}
      className="lumina-choice-picker"
      style={weightStyle(props.weight)}
      role="group"
      aria-label={label ?? 'Choices'}
    >
      {label && <div className="lumina-field-label">{label}</div>}
      {filterable && (
        <div className="lumina-input-shell lumina-choice-filter">
          <span className="lumina-input-prefix">
            <Search size={14} />
          </span>
          <input
            type="search"
            className="lumina-input"
            placeholder="Filter options..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}
      <div className={`lumina-choice-group lumina-choice-${displayStyle}`}>
        {filtered.map((opt) => {
          const val = readString(opt.value);
          const isSelected = selected.includes(val);
          const icon = readOptionalString(opt.icon);
          const description = readOptionalString(opt.description);
          const badge = readOptionalString(opt.badge);
          return (
            <motion.button
              key={val}
              type="button"
              aria-pressed={isSelected}
              whileTap={{ scale: 0.97 }}
              transition={springTactile}
              className={`lumina-choice-item ${isSelected ? 'is-selected' : ''}`.trim()}
              onClick={() => toggle(val)}
            >
              {displayStyle === 'checkbox' && (
                <span
                  className={`lumina-checkbox-box ${isSelected ? 'is-checked' : ''}`.trim()}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </span>
              )}
              {icon && <LuminaIconGlyph name={icon} size="sm" />}
              <span className="lumina-choice-text">
                <span className="lumina-choice-label">{readString(opt.label)}</span>
                {description && <span className="lumina-choice-desc">{description}</span>}
              </span>
              {badge && <span className="lumina-choice-badge">{badge}</span>}
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

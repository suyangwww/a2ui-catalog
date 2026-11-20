import React from 'react';
import { motion } from 'motion/react';
import { Check, Search } from 'lucide-react';
import {
  LuminaIconGlyph,
  ValidationErrors,
  invokeSetter,
  isCallable,
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  readStringArray,
  safeUrl,
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
  const propSelected = readStringArray(props.value);
  const [localSelected, setLocalSelected] = React.useState<string[]>(propSelected);
  React.useEffect(() => {
    setLocalSelected(propSelected);
  }, [props.value]);

  const selected = isCallable(props.setValue) ? propSelected : localSelected;
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
    const next = isMulti
      ? selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val]
      : [val];
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, next);
    } else {
      setLocalSelected(next);
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
          const eyebrow = readOptionalString(opt.eyebrow);
          const badge = readOptionalString(opt.badge);
          const imgUrl = safeUrl(readOptionalString(opt.imageUrl));
          return (
            <motion.button
              key={val}
              type="button"
              aria-pressed={isSelected}
              whileTap={{ scale: 0.98 }}
              transition={springTactile}
              className={`lumina-choice-item ${displayStyle === 'gallery' ? 'is-gallery-card' : ''} ${isSelected ? 'is-selected' : ''}`.trim()}
              onClick={() => toggle(val)}
            >
              {displayStyle === 'gallery' && imgUrl && (
                <span className="lumina-choice-gallery-media">
                  <img src={imgUrl} alt={readString(opt.label)} loading="lazy" />
                  {isSelected && (
                    <span className="lumina-choice-gallery-check" aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </span>
              )}
              {displayStyle === 'checkbox' && (
                <span
                  className={`lumina-checkbox-box ${isSelected ? 'is-checked' : ''}`.trim()}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </span>
              )}
              {icon && displayStyle !== 'gallery' && <LuminaIconGlyph name={icon} size="sm" />}
              <span className="lumina-choice-text">
                {eyebrow && <span className="lumina-choice-eyebrow">{eyebrow}</span>}
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

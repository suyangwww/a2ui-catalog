import React from 'react';
import { motion } from 'motion/react';
import { Check, RotateCcw } from 'lucide-react';
import {
  ValidationErrors,
  invokeSetter,
  isCallable,
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  readStringArray,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ChecklistCardRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const title = readString(props.title, 'Checklist');
  const subtitle = readOptionalString(props.subtitle);
  const items = readRecordArray(props.items);
  const propChecked = readStringArray(props.value);
  const [localChecked, setLocalChecked] = React.useState<string[]>(propChecked);

  React.useEffect(() => {
    setLocalChecked(propChecked);
  }, [props.value]);

  const checkedIds = isCallable(props.setValue) ? propChecked : localChecked;
  const checkedSet = new Set(checkedIds);
  const showProgress = readBoolean(props.showProgress, true);
  const resettable = readBoolean(props.resettable, true);

  const validIds = new Set(items.map((it, idx) => readString(it.id, `item-${idx}`)));
  const doneCount = checkedIds.filter((id) => validIds.has(id)).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const commit = (next: string[]) => {
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, next);
    } else {
      setLocalChecked(next);
    }
  };

  const toggleItem = (id: string) => {
    const next = checkedSet.has(id)
      ? checkedIds.filter((x) => x !== id)
      : [...checkedIds, id];
    commit(next);
  };

  return (
    <section
      ref={accessibilityRef}
      className="lumina-checklist-card"
      style={weightStyle(props.weight)}
      aria-label={title}
    >
      <header className="lumina-checklist-header">
        <div className="lumina-checklist-heading">
          <h3 className="lumina-checklist-title">{title}</h3>
          {subtitle && <p className="lumina-checklist-subtitle">{subtitle}</p>}
        </div>
        <div className="lumina-checklist-meta">
          <span className="lumina-checklist-counter lumina-tabular">
            {doneCount} of {totalCount}
          </span>
          {resettable && doneCount > 0 && (
            <button
              type="button"
              className="lumina-checklist-reset"
              onClick={() => commit([])}
              aria-label={`Reset ${title}`}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {showProgress && (
        <div
          className="lumina-checklist-progress-track"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
        >
          <div className="lumina-checklist-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      )}

      <div className="lumina-checklist-list" role="group" aria-label={`${title} steps`}>
        {items.map((item, idx) => {
          const id = readString(item.id, `item-${idx}`);
          const isDone = checkedSet.has(id);
          const time = readOptionalString(item.time);
          const detail = readOptionalString(item.detail);
          const badge = readOptionalString(item.badge);
          return (
            <motion.button
              key={id}
              type="button"
              role="checkbox"
              aria-checked={isDone}
              whileTap={{ scale: 0.99 }}
              transition={springTactile}
              className={`lumina-checklist-row ${isDone ? 'is-done' : ''}`.trim()}
              onClick={() => toggleItem(id)}
            >
              <span className={`lumina-checklist-circle ${isDone ? 'is-done' : ''}`.trim()}>
                {isDone && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="lumina-checklist-body">
                <span className="lumina-checklist-row-top">
                  {time && <span className="lumina-checklist-time lumina-tabular">{time}</span>}
                  <span className="lumina-checklist-item-title">{readString(item.title)}</span>
                  {badge && <span className="lumina-checklist-badge">{badge}</span>}
                </span>
                {detail && <span className="lumina-checklist-detail">{detail}</span>}
              </span>
            </motion.button>
          );
        })}
      </div>

      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </section>
  );
}

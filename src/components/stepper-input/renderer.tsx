import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import {
  ValidationErrors,
  invokeSetter,
  readNumber,
  readOptionalString,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function StepperInputRenderer({
  props,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const min = readNumber(props.min, 0);
  const max = readNumber(props.max, 99);
  const step = readNumber(props.step, 1);
  const val = readNumber(props.value, min);
  const label = readString(props.label);
  const description = readOptionalString(props.description);
  const [dir, setDir] = React.useState<1 | -1>(1);

  const dec = () => {
    if (val - step < min) return;
    setDir(-1);
    invokeSetter(props.setValue, Math.max(min, val - step));
  };

  const inc = () => {
    if (val + step > max) return;
    setDir(1);
    invokeSetter(props.setValue, Math.min(max, val + step));
  };

  return (
    <div className="lumina-stepper-field" style={weightStyle(props.weight)}>
      <div className="lumina-stepper-row">
        <div className="lumina-stepper-copy">
          <span className="lumina-stepper-label">{label}</span>
          {description && <span className="lumina-stepper-desc">{description}</span>}
        </div>
        <div
          ref={accessibilityRef}
          className="lumina-stepper-controls"
          role="group"
          aria-label={label}
        >
          <motion.button
            type="button"
            className="lumina-stepper-btn"
            aria-label={`Decrease ${label}`}
            disabled={val <= min}
            {...(val > min ? { whileTap: { scale: 0.9 } } : {})}
            transition={springTactile}
            onClick={dec}
          >
            <Minus size={15} strokeWidth={2.2} />
          </motion.button>
          <div className="lumina-stepper-value lumina-tabular" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={val}
                initial={{ y: dir * 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: dir * -10, opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                {val}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.button
            type="button"
            className="lumina-stepper-btn"
            aria-label={`Increase ${label}`}
            disabled={val >= max}
            {...(val < max ? { whileTap: { scale: 0.9 } } : {})}
            transition={springTactile}
            onClick={inc}
          >
            <Plus size={15} strokeWidth={2.2} />
          </motion.button>
        </div>
      </div>
      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />
    </div>
  );
}

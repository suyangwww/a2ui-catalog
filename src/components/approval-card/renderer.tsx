import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import {
  ValidationErrors,
  invokeAction,
  invokeSetter,
  isCallable,
  readOptionalString,
  readString,
  renderChildRef,
  springFluid,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function normalizeApprovalState(raw: unknown): 'pending' | 'approved' | 'rejected' {
  if (raw === 'approved' || raw === 'rejected') return raw;
  return 'pending';
}

function normalizeRisk(raw: unknown): 'low' | 'medium' | 'high' {
  if (raw === 'low' || raw === 'high') return raw;
  return 'medium';
}

export function ApprovalCardRenderer({
  props,
  buildChild,
  accessibilityRef,
  validationErrorsRef,
}: LuminaReactRenderArgs): React.ReactNode {
  const title = readString(props.title);
  const description = readOptionalString(props.description);
  const riskLevel = normalizeRisk(props.riskLevel);
  const [localState, setLocalState] = React.useState<'pending' | 'approved' | 'rejected' | null>(
    null,
  );
  const currentState = localState ?? normalizeApprovalState(props.state);
  const isValid = props.isValid !== false;
  const [submitting, setSubmitting] = React.useState(false);

  const riskBadgeLabel =
    riskLevel === 'high'
      ? 'High Impact'
      : riskLevel === 'medium'
        ? 'Confirmation Required'
        : 'Review';

  const handleApprove = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      setLocalState('approved');
      invokeSetter(props.setState, 'approved');
      await invokeAction(props.approveAction);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      setLocalState('rejected');
      invokeSetter(props.setState, 'rejected');
      await invokeAction(props.rejectAction);
    } finally {
      setSubmitting(false);
    }
  };

  const wStyle = weightStyle(props.weight);

  return (
    <motion.section
      ref={accessibilityRef}
      layout
      transition={springFluid}
      className={`lumina-approval lumina-risk-${riskLevel} lumina-approval-${currentState}`}
      {...(wStyle ? { style: wStyle } : {})}
      aria-label={title}
    >
      <div className="lumina-approval-header">
        <div className="lumina-approval-title-row">
          <span className={`lumina-approval-icon lumina-risk-fg-${riskLevel}`}>
            {riskLevel === 'high' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
          </span>
          <div>
            <div className="lumina-approval-title">{title}</div>
            {description && <div className="lumina-approval-desc">{description}</div>}
          </div>
        </div>
        <span
          className={`lumina-badge lumina-badge-${riskLevel === 'high' ? 'critical' : riskLevel === 'medium' ? 'warning' : 'info'} lumina-badge-sm`}
        >
          {riskBadgeLabel}
        </span>
      </div>

      {Boolean(props.details) && (
        <div className="lumina-approval-details">{renderChildRef(buildChild, props.details)}</div>
      )}

      <ValidationErrors
        errors={props.validationErrors}
        validationErrorsRef={validationErrorsRef}
      />

      <AnimatePresence mode="wait" initial={false}>
        {currentState === 'pending' ? (
          <motion.div
            key="pending"
            className="lumina-approval-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isCallable(props.rejectAction) && (
              <motion.button
                type="button"
                className="lumina-btn lumina-btn-secondary lumina-btn-md"
                whileTap={{ scale: 0.97 }}
                transition={springTactile}
                disabled={submitting}
                onClick={() => void handleReject()}
              >
                <X size={15} />
                <span>{readString(props.rejectLabel, 'Decline')}</span>
              </motion.button>
            )}
            <motion.button
              type="button"
              className={`lumina-btn ${riskLevel === 'high' ? 'lumina-btn-danger' : 'lumina-btn-primary'} lumina-btn-md`}
              {...(isValid ? { whileTap: { scale: 0.97 } } : {})}
              transition={springTactile}
              disabled={!isValid || submitting}
              onClick={() => void handleApprove()}
            >
              <Check size={15} strokeWidth={2.5} />
              <span>{readString(props.approveLabel, 'Approve')}</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="receipt"
            className={`lumina-approval-receipt is-${currentState}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springFluid}
          >
            {currentState === 'approved' ? (
              <>
                <Check size={15} strokeWidth={2.6} />
                <span>Approved and dispatched to agent</span>
              </>
            ) : (
              <>
                <X size={15} strokeWidth={2.6} />
                <span>Declined by user</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

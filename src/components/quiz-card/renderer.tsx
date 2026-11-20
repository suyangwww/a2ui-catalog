import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Lightbulb, RotateCcw } from 'lucide-react';
import {
  invokeSetter,
  isCallable,
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  springFluid,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuizCardRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const questions = readRecordArray(props.questions);
  const showScore = readBoolean(props.showScore, true);

  const [index, setIndex] = React.useState(0);
  const [hintOpen, setHintOpen] = React.useState(false);
  const [answers, setAnswers] = React.useState<Record<string, string>>(() => {
    const initial = readOptionalString(props.value);
    const firstId = readString(questions[0]?.id, 'q0');
    return initial ? { [firstId]: initial } : {};
  });

  const safeIdx = Math.max(0, Math.min(questions.length - 1, index));
  const currentQ = questions[safeIdx];
  if (!currentQ) return null;

  const qId = readString(currentQ.id, `q-${safeIdx}`);
  const prompt = readString(currentQ.prompt);
  const hint = readOptionalString(currentQ.hint);
  const correctId = readString(currentQ.correctOptionId);
  const generalExp = readOptionalString(currentQ.explanation);
  const options = readRecordArray(currentQ.options);

  const propSingleVal = questions.length === 1 ? readOptionalString(props.value) : undefined;
  const chosenId = propSingleVal ?? answers[qId];

  const answeredCount = questions.filter((q, i) => {
    const id = readString(q.id, `q-${i}`);
    return Boolean(answers[id] ?? (i === 0 ? propSingleVal : undefined));
  }).length;
  const correctCount = questions.filter((q, i) => {
    const id = readString(q.id, `q-${i}`);
    const ans = answers[id] ?? (i === 0 ? propSingleVal : undefined);
    return ans !== undefined && ans === readString(q.correctOptionId);
  }).length;

  const pickOption = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
    if (questions.length === 1 && isCallable(props.setValue)) {
      invokeSetter(props.setValue, optId);
    }
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setHintOpen(false);
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, '');
    }
  };

  return (
    <section
      className="lumina-quiz-card"
      style={weightStyle(props.weight)}
      aria-label={title ?? 'Knowledge check'}
    >
      {(title || subtitle) && (
        <div className="lumina-quiz-meta-head">
          {title && <div className="lumina-quiz-eyebrow">{title}</div>}
          {subtitle && <div className="lumina-quiz-sub">{subtitle}</div>}
        </div>
      )}

      <div className="lumina-quiz-top-bar">
        <h3 className="lumina-quiz-prompt">{prompt}</h3>
        <div className="lumina-quiz-controls">
          {questions.length > 1 && (
            <div className="lumina-quiz-pager lumina-tabular">
              <button
                type="button"
                className="lumina-quiz-icon-btn"
                disabled={safeIdx === 0}
                onClick={() => {
                  setIndex((i) => Math.max(0, i - 1));
                  setHintOpen(false);
                }}
                aria-label="Previous question"
              >
                <ChevronLeft size={15} />
              </button>
              <span>
                {safeIdx + 1} of {questions.length}
              </span>
              <button
                type="button"
                className="lumina-quiz-icon-btn"
                disabled={safeIdx >= questions.length - 1}
                onClick={() => {
                  setIndex((i) => Math.min(questions.length - 1, i + 1));
                  setHintOpen(false);
                }}
                aria-label="Next question"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
          {hint && (
            <button
              type="button"
              className={`lumina-quiz-icon-btn ${hintOpen ? 'is-active' : ''}`.trim()}
              onClick={() => setHintOpen((h) => !h)}
              aria-label="Toggle hint"
              aria-expanded={hintOpen}
            >
              <Lightbulb size={15} />
            </button>
          )}
          {answeredCount > 0 && (
            <button
              type="button"
              className="lumina-quiz-icon-btn"
              onClick={restart}
              aria-label="Restart quiz"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hint && hintOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springFluid}
            className="lumina-quiz-hint"
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lumina-quiz-options" role="radiogroup" aria-label={prompt}>
        {options.map((opt, idx) => {
          const optId = readString(opt.id, `opt-${idx}`);
          const optLabel = readString(opt.label);
          const optExp = readOptionalString(opt.explanation);
          const isChosen = chosenId === optId;
          const isCorrect = optId === correctId;
          const stateClass = chosenId
            ? isChosen
              ? isCorrect
                ? 'is-correct'
                : 'is-wrong'
              : isCorrect
                ? 'is-reveal-correct'
                : ''
            : '';

          return (
            <motion.button
              key={optId}
              type="button"
              role="radio"
              aria-checked={isChosen}
              whileTap={{ scale: 0.99 }}
              transition={springTactile}
              className={`lumina-quiz-option ${stateClass}`.trim()}
              onClick={() => pickOption(optId)}
            >
              <span className="lumina-quiz-letter">{LETTERS[idx] ?? String(idx + 1)}</span>
              <span className="lumina-quiz-opt-content">
                <span className="lumina-quiz-opt-label">{optLabel}</span>
                {isChosen && (optExp || generalExp) && (
                  <span className="lumina-quiz-opt-exp">
                    {isCorrect ? 'Correct. ' : 'Not quite. '}
                    {optExp ?? generalExp}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {(questions.length > 1 || (showScore && answeredCount > 0)) && (
        <div className="lumina-quiz-footer">
          {showScore && answeredCount > 0 ? (
            <span className="lumina-quiz-score lumina-tabular">
              Score: {correctCount} / {questions.length}
            </span>
          ) : (
            <span />
          )}
          {questions.length > 1 && safeIdx < questions.length - 1 && (
            <button
              type="button"
              className="lumina-quiz-next-btn"
              onClick={() => {
                setIndex((i) => Math.min(questions.length - 1, i + 1));
                setHintOpen(false);
              }}
            >
              Next
            </button>
          )}
        </div>
      )}
    </section>
  );
}

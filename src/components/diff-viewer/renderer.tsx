import React from 'react';
import { Check, X } from 'lucide-react';
import {
  invokeAction,
  isCallable,
  readString,
  useIsMobileViewport,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import { computeLineDiff } from './lcs-diff.js';

export function DiffViewerRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const isMobile = useIsMobileViewport();
  const before = readString(props.before);
  const after = readString(props.after);
  const filename = readString(props.filename, 'Proposed Changes');
  const requestedMode = props.viewMode === 'split' ? 'split' : 'unified';
  const effectiveMode = isMobile ? 'unified' : requestedMode;

  const lines = React.useMemo(() => computeLineDiff(before, after), [before, after]);
  const added = lines.filter((l) => l.type === 'add').length;
  const removed = lines.filter((l) => l.type === 'remove').length;
  const hasAccept = isCallable(props.acceptAction);
  const hasReject = isCallable(props.rejectAction);

  return (
    <div className="lumina-diff" style={weightStyle(props.weight)}>
      <div className="lumina-diff-header">
        <div className="lumina-diff-meta">
          <span className="lumina-diff-filename">{filename}</span>
          <span className="lumina-diff-stats lumina-tabular">
            <span className="is-add">+{added}</span>
            <span className="is-remove">-{removed}</span>
          </span>
        </div>
        {(hasAccept || hasReject) && (
          <div className="lumina-diff-actions">
            {hasReject && (
              <button
                type="button"
                className="lumina-codeblock-btn"
                onClick={() => void invokeAction(props.rejectAction)}
              >
                <X size={13} />
                <span>Reject</span>
              </button>
            )}
            {hasAccept && (
              <button
                type="button"
                className="lumina-codeblock-btn is-accent"
                onClick={() => void invokeAction(props.acceptAction)}
              >
                <Check size={13} />
                <span>Accept</span>
              </button>
            )}
          </div>
        )}
      </div>

      {effectiveMode === 'split' ? (
        <div className="lumina-diff-split">
          <div className="lumina-diff-pane">
            {lines
              .filter((l) => l.type !== 'add')
              .map((l, idx) => (
                <div key={idx} className={`lumina-diff-line is-${l.type}`}>
                  <span className="lumina-diff-ln lumina-tabular">{l.oldNum ?? ''}</span>
                  <span className="lumina-diff-sign">{l.type === 'remove' ? '-' : ' '}</span>
                  <span className="lumina-diff-code">{l.text || ' '}</span>
                </div>
              ))}
          </div>
          <div className="lumina-diff-pane">
            {lines
              .filter((l) => l.type !== 'remove')
              .map((l, idx) => (
                <div key={idx} className={`lumina-diff-line is-${l.type}`}>
                  <span className="lumina-diff-ln lumina-tabular">{l.newNum ?? ''}</span>
                  <span className="lumina-diff-sign">{l.type === 'add' ? '+' : ' '}</span>
                  <span className="lumina-diff-code">{l.text || ' '}</span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="lumina-diff-unified">
          {lines.map((l, idx) => (
            <div key={idx} className={`lumina-diff-line is-${l.type}`}>
              <span className="lumina-diff-ln lumina-tabular">{l.oldNum ?? ''}</span>
              <span className="lumina-diff-ln lumina-tabular">{l.newNum ?? ''}</span>
              <span className="lumina-diff-sign">
                {l.type === 'add' ? '+' : l.type === 'remove' ? '-' : ' '}
              </span>
              <span className="lumina-diff-code">{l.text || ' '}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

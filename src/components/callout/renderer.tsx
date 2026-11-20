import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import {
  LuminaIconGlyph,
  invokeAction,
  isCallable,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function DefaultCalloutIcon({ tone }: { tone: string }) {
  switch (tone) {
    case 'tip':
      return <Lightbulb size={17} />;
    case 'success':
      return <CheckCircle2 size={17} />;
    case 'warning':
      return <AlertTriangle size={17} />;
    case 'critical':
      return <AlertCircle size={17} />;
    default:
      return <Info size={17} />;
  }
}

export function CalloutRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const tone = readString(props.tone, 'info');
  const title = readOptionalString(props.title);
  const body = readString(props.body);
  const icon = readOptionalString(props.icon);

  return (
    <div
      className={`lumina-callout lumina-callout-${tone}`}
      style={weightStyle(props.weight)}
      role={tone === 'critical' || tone === 'warning' ? 'alert' : 'note'}
    >
      <span className="lumina-callout-icon">
        {icon ? <LuminaIconGlyph name={icon} size="sm" /> : <DefaultCalloutIcon tone={tone} />}
      </span>
      <div className="lumina-callout-content">
        {title && <div className="lumina-callout-title">{title}</div>}
        <div className="lumina-callout-body">{body}</div>
      </div>
      {isCallable(props.action) && (
        <button
          type="button"
          className="lumina-btn lumina-btn-secondary lumina-btn-sm"
          onClick={() => void invokeAction(props.action)}
        >
          {readString(props.actionLabel, 'Action')}
        </button>
      )}
    </div>
  );
}

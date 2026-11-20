import React from 'react';
import { motion } from 'motion/react';
import {
  invokeAction,
  isCallable,
  normalizeChildList,
  readOptionalString,
  readString,
  renderChildRef,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function CardRenderer({ props, buildChild }: LuminaReactRenderArgs): React.ReactNode {
  const variant = readString(props.variant, 'elevated');
  const padding = readString(props.padding, 'md');
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const childList = normalizeChildList(props.children);
  const hasAction = isCallable(props.action);

  const content = (
    <>
      {(title || subtitle || Boolean(props.headerTrailing)) && (
        <div className="lumina-card-header">
          <div className="lumina-card-header-text">
            {title && <div className="lumina-card-title">{title}</div>}
            {subtitle && <div className="lumina-card-subtitle">{subtitle}</div>}
          </div>
          {Boolean(props.headerTrailing) && (
            <div className="lumina-card-trailing">
              {renderChildRef(buildChild, props.headerTrailing)}
            </div>
          )}
        </div>
      )}
      <div className="lumina-card-body">
        {Boolean(props.child) && renderChildRef(buildChild, props.child)}
        {childList.length > 0 && (
          <div className="lumina-column" style={{ gap: 'var(--lumina-space-md)' }}>
            {childList.map((ref, idx) => renderChildRef(buildChild, ref, idx))}
          </div>
        )}
      </div>
      {Boolean(props.footer) && (
        <div className="lumina-card-footer">{renderChildRef(buildChild, props.footer)}</div>
      )}
    </>
  );

  const wStyle = weightStyle(props.weight);

  if (hasAction) {
    return (
      <motion.div
        role="button"
        tabIndex={0}
        className={`lumina-card lumina-card-${variant} lumina-pad-${padding} is-interactive`}
        {...(wStyle ? { style: wStyle } : {})}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={springTactile}
        onClick={() => void invokeAction(props.action)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            void invokeAction(props.action);
          }
        }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div
      className={`lumina-card lumina-card-${variant} lumina-pad-${padding}`}
      style={weightStyle(props.weight)}
    >
      {content}
    </div>
  );
}

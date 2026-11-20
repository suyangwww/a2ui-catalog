import React from 'react';
import { motion } from 'motion/react';
import {
  LuminaIconGlyph,
  invokeSetter,
  readNumber,
  readOptionalString,
  readRecordArray,
  readString,
  renderChildRef,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function TabsRenderer({ props, buildChild }: LuminaReactRenderArgs): React.ReactNode {
  const layoutId = React.useId();
  const tabs = readRecordArray(props.tabs);
  const defaultIdx = Math.max(0, Math.min(tabs.length - 1, readNumber(props.defaultIndex, 0)));
  const [localIdx, setLocalIdx] = React.useState(defaultIdx);

  const controlledIdx = React.useMemo(() => {
    if (props.selectedValue === undefined || props.selectedValue === null) return null;
    const raw = String(props.selectedValue);
    const num = Number(raw);
    if (Number.isInteger(num) && num >= 0 && num < tabs.length) return num;
    const byTitle = tabs.findIndex((t) => readString(t.title) === raw);
    return byTitle >= 0 ? byTitle : null;
  }, [props.selectedValue, tabs]);

  const activeIdx = controlledIdx ?? Math.min(localIdx, Math.max(0, tabs.length - 1));
  const variant = readString(props.variant, 'segmented');

  const selectTab = (idx: number) => {
    setLocalIdx(idx);
    invokeSetter(props.setSelectedValue, String(idx));
  };

  const activeTab = tabs[activeIdx] ?? tabs[0];
  if (!activeTab) return null;

  return (
    <div className={`lumina-tabs lumina-tabs-${variant}`} style={weightStyle(props.weight)}>
      <div className="lumina-tabs-list" role="tablist">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIdx;
          const icon = readOptionalString(tab.icon);
          const badge = readOptionalString(tab.badge);
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`lumina-tab-trigger ${isActive ? 'is-active' : ''}`.trim()}
              onClick={() => selectTab(idx)}
            >
              {isActive && (
                <motion.span
                  layoutId={`tab-pill-${layoutId}`}
                  className="lumina-tab-indicator"
                  transition={springTactile}
                />
              )}
              <span className="lumina-tab-label">
                {icon && <LuminaIconGlyph name={icon} size="xs" />}
                <span>{readString(tab.title)}</span>
                {badge && <span className="lumina-tab-badge">{badge}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <motion.div
        key={activeIdx}
        role="tabpanel"
        className="lumina-tab-panel"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16 }}
      >
        {renderChildRef(buildChild, activeTab.child)}
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import {
  invokeAction,
  isCallable,
  isPlainRecord,
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  springTactile,
  useIsMobileViewport,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function readOptionCell(opt: Record<string, unknown>, criterionKey: string): string {
  const values = opt.values;
  if (!isPlainRecord(values)) return '—';
  return readString(values[criterionKey], '—');
}

export function ComparisonMatrixRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const isMobile = useIsMobileViewport();
  const title = readOptionalString(props.title);
  const criteria = readRecordArray(props.criteria);
  const options = readRecordArray(props.options);

  return (
    <div className="lumina-compare" style={weightStyle(props.weight)}>
      {title && <div className="lumina-section-title">{title}</div>}
      {isMobile ? (
        <div className="lumina-compare-mobile-rail">
          {options.map((opt, idx) => {
            const optId = readString(opt.id, String(idx));
            const recommended = readBoolean(opt.recommended, false);
            const subtitle = readOptionalString(opt.subtitle);
            const badge = readOptionalString(opt.badge);
            return (
              <div
                key={optId}
                className={`lumina-compare-mobile-card ${recommended ? 'is-recommended' : ''}`.trim()}
              >
                <div className="lumina-compare-opt-head">
                  <div>
                    <div className="lumina-compare-opt-title">{readString(opt.title)}</div>
                    {subtitle && (
                      <div className="lumina-compare-opt-sub lumina-tabular">{subtitle}</div>
                    )}
                  </div>
                  {badge && (
                    <span className="lumina-badge lumina-badge-accent lumina-badge-sm">
                      {badge}
                    </span>
                  )}
                </div>
                <dl className="lumina-compare-mobile-rows">
                  {criteria.map((c) => {
                    const cKey = readString(c.key);
                    return (
                      <div key={cKey} className="lumina-compare-mobile-row">
                        <dt>{readString(c.label)}</dt>
                        <dd className="lumina-tabular">{readOptionCell(opt, cKey)}</dd>
                      </div>
                    );
                  })}
                </dl>
                {isCallable(opt.action) && (
                  <motion.button
                    type="button"
                    className={`lumina-btn ${recommended ? 'lumina-btn-primary' : 'lumina-btn-secondary'} lumina-btn-md is-full`}
                    whileTap={{ scale: 0.97 }}
                    transition={springTactile}
                    onClick={() => void invokeAction(opt.action)}
                  >
                    {readString(opt.actionLabel, 'Select')}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="lumina-compare-table-wrap">
          <table className="lumina-compare-table">
            <thead>
              <tr>
                <th className="lumina-compare-corner" />
                {options.map((opt, idx) => {
                  const optId = readString(opt.id, String(idx));
                  const recommended = readBoolean(opt.recommended, false);
                  const subtitle = readOptionalString(opt.subtitle);
                  const badge = readOptionalString(opt.badge);
                  return (
                    <th
                      key={optId}
                      className={`lumina-compare-col-head ${recommended ? 'is-recommended' : ''}`.trim()}
                    >
                      {badge && (
                        <div className="lumina-compare-badge-slot">
                          <span className="lumina-badge lumina-badge-accent lumina-badge-sm">
                            {badge}
                          </span>
                        </div>
                      )}
                      <div className="lumina-compare-opt-title">{readString(opt.title)}</div>
                      {subtitle && (
                        <div className="lumina-compare-opt-sub lumina-tabular">{subtitle}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => {
                const cKey = readString(c.key);
                return (
                  <tr key={cKey}>
                    <th className="lumina-compare-row-label">{readString(c.label)}</th>
                    {options.map((opt, idx) => {
                      const optId = readString(opt.id, String(idx));
                      const recommended = readBoolean(opt.recommended, false);
                      return (
                        <td
                          key={optId}
                          className={`lumina-compare-cell lumina-tabular ${recommended ? 'is-recommended' : ''}`.trim()}
                        >
                          {readOptionCell(opt, cKey)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {options.some((o) => isCallable(o.action)) && (
                <tr className="lumina-compare-action-row">
                  <th />
                  {options.map((opt, idx) => {
                    const optId = readString(opt.id, String(idx));
                    const recommended = readBoolean(opt.recommended, false);
                    return (
                      <td key={optId} className={recommended ? 'is-recommended' : undefined}>
                        {isCallable(opt.action) && (
                          <motion.button
                            type="button"
                            className={`lumina-btn ${recommended ? 'lumina-btn-primary' : 'lumina-btn-secondary'} lumina-btn-sm is-full`}
                            whileTap={{ scale: 0.97 }}
                            transition={springTactile}
                            onClick={() => void invokeAction(opt.action)}
                          >
                            {readString(opt.actionLabel, 'Select')}
                          </motion.button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

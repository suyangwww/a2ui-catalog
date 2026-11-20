import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  invokeAction,
  isCallable,
  readOptionalNumber,
  readOptionalString,
  readRecordArray,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function DataTableRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const columns = readRecordArray(props.columns);
  const rawRows = readRecordArray(props.rows);
  const rowKey = readString(props.rowKey, 'id');
  const caption = readOptionalString(props.caption);
  const maxRows = readOptionalNumber(props.maxRows);
  const hasRowAction = isCallable(props.rowAction);

  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [showAll, setShowAll] = React.useState(false);

  const sortedRows = React.useMemo(() => {
    if (!sortKey) return rawRows;
    return [...rawRows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const an = Number(av);
      const bn = Number(bv);
      const cmp =
        Number.isFinite(an) && Number.isFinite(bn)
          ? an - bn
          : String(av ?? '').localeCompare(String(bv ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rawRows, sortKey, sortDir]);

  const visibleRows =
    maxRows !== undefined && !showAll ? sortedRows.slice(0, maxRows) : sortedRows;

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const formatCell = (val: unknown, col: Record<string, unknown>): React.ReactNode => {
    if (val === null || val === undefined) return '—';
    const fmt = readString(col.format, 'text');
    if (fmt === 'currency') {
      const n = Number(val);
      if (Number.isFinite(n)) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: readString(col.currency, 'USD'),
          maximumFractionDigits: Math.abs(n) >= 1000 ? 0 : 2,
        }).format(n);
      }
    }
    if (fmt === 'percent') {
      const n = Number(val);
      if (Number.isFinite(n)) {
        const ratio = Math.abs(n) > 1 ? n / 100 : n;
        return `${(ratio * 100).toFixed(1)}%`;
      }
    }
    if (fmt === 'number') {
      const n = Number(val);
      if (Number.isFinite(n)) return n.toLocaleString('en-US');
    }
    if (fmt === 'badge') {
      return (
        <span className="lumina-badge lumina-badge-neutral lumina-badge-sm">{String(val)}</span>
      );
    }
    return String(val);
  };

  return (
    <div className="lumina-table-card" style={weightStyle(props.weight)}>
      {caption && <div className="lumina-table-caption">{caption}</div>}
      <div className="lumina-table-scroll">
        <table className="lumina-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const colKey = readString(col.key);
                const align = readString(col.align, 'start');
                return (
                  <th key={colKey} className={`lumina-align-${align}`}>
                    {col.sortable !== false ? (
                      <button
                        type="button"
                        className={`lumina-table-sort-btn ${sortKey === colKey ? 'is-sorted' : ''}`.trim()}
                        onClick={() => toggleSort(colKey)}
                      >
                        <span>{readString(col.header)}</span>
                        <ArrowUpDown size={12} />
                      </button>
                    ) : (
                      <span>{readString(col.header)}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rIdx) => (
              <tr
                key={readString(row[rowKey], String(rIdx))}
                className={hasRowAction ? 'is-clickable' : undefined}
                onClick={hasRowAction ? () => void invokeAction(props.rowAction) : undefined}
              >
                {columns.map((col) => {
                  const colKey = readString(col.key);
                  const align = readString(col.align, 'start');
                  const fmt = readString(col.format, 'text');
                  const isNumeric = fmt === 'number' || fmt === 'currency' || fmt === 'percent';
                  return (
                    <td
                      key={colKey}
                      className={`lumina-align-${align} ${isNumeric ? 'lumina-tabular' : ''}`.trim()}
                    >
                      {formatCell(row[colKey], col)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {maxRows !== undefined && sortedRows.length > maxRows && (
        <button
          type="button"
          className="lumina-table-expand"
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? 'Show fewer rows' : `Show all ${sortedRows.length} rows`}
        </button>
      )}
    </div>
  );
}

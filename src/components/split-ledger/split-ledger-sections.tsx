import React from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { LedgerItemState } from './split-math.js';

export function SplitLedgerItemsSection({
  items,
  guests,
  unassignedIds,
  onChangeItems,
  onAddDish,
}: {
  items: LedgerItemState[];
  guests: string[];
  unassignedIds: Set<string>;
  onChangeItems: React.Dispatch<React.SetStateAction<LedgerItemState[]>>;
  onAddDish: () => void;
}): React.ReactNode {
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const displayGuest = (i: number) => guests[i]?.trim() || `Person ${i + 1}`;

  return (
    <div className="lumina-ledger-section">
      <div className="lumina-ledger-sec-title">02 / What did you order?</div>
      <p className="lumina-ledger-hint">
        Enter each dish and check everyone who shared it. The cost is divided equally among selected
        guests.
      </p>
      <div className="lumina-ledger-items">
        {items.map((item, idx) => {
          const invalid = unassignedIds.has(item.id);
          return (
            <div
              key={item.id}
              className={`lumina-ledger-item ${invalid ? 'is-invalid' : ''}`.trim()}
            >
              <div className="lumina-ledger-item-top">
                <span className="lumina-ledger-item-num">ITEM {pad2(idx + 1)}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    className="lumina-ledger-remove-btn"
                    aria-label={`Remove item ${idx + 1}`}
                    onClick={() => onChangeItems((prev) => prev.filter((x) => x.id !== item.id))}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="lumina-ledger-order-fields">
                <label className="lumina-ledger-field">
                  <span>Dish or drink</span>
                  <input
                    type="text"
                    className="lumina-ledger-input"
                    placeholder="e.g. Truffle pasta"
                    value={item.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      onChangeItems((prev) =>
                        prev.map((x) => (x.id === item.id ? { ...x, name: v } : x)),
                      );
                    }}
                  />
                </label>
                <label className="lumina-ledger-field">
                  <span>Price ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="lumina-ledger-input lumina-tabular"
                    placeholder="0.00"
                    value={item.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      onChangeItems((prev) =>
                        prev.map((x) => (x.id === item.id ? { ...x, price: v } : x)),
                      );
                    }}
                  />
                </label>
              </div>
              <div className="lumina-ledger-who-label">WHO HAD IT?</div>
              <div className="lumina-ledger-diners">
                {guests.map((_, gIdx) => {
                  const checked = Boolean(item.selected[gIdx]);
                  return (
                    <button
                      key={gIdx}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      className={`lumina-ledger-diner-chip ${checked ? 'is-checked' : ''}`.trim()}
                      onClick={() => {
                        onChangeItems((prev) =>
                          prev.map((x) =>
                            x.id === item.id
                              ? {
                                  ...x,
                                  selected: x.selected.map((on, i) => (i === gIdx ? !on : on)),
                                }
                              : x,
                          ),
                        );
                      }}
                    >
                      <span className="lumina-ledger-diner-dot">
                        {checked && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span>{displayGuest(gIdx)}</span>
                    </button>
                  );
                })}
              </div>
              {invalid && (
                <p className="lumina-ledger-error">Select at least one guest for this item.</p>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" className="lumina-ledger-pill-btn" onClick={onAddDish}>
        <Plus size={14} />
        <span>Add another item</span>
      </button>
    </div>
  );
}

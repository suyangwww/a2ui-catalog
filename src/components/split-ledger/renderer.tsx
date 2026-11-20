import React from 'react';
import { ArrowRight, Copy } from 'lucide-react';
import { emitLuminaToast } from '../../protocol/index.js';
import {
  readBoolean,
  readNumber,
  readNumberArray,
  readOptionalString,
  readRecordArray,
  readString,
  readStringArray,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import { SplitLedgerItemsSection } from './split-ledger-sections.js';
import {
  buildSplitSummaryText,
  computeLedgerSplit,
  formatMoneyCents,
  type LedgerItemState,
} from './split-math.js';

export function SplitLedgerRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const eyebrow = readOptionalString(props.eyebrow);
  const title = readString(props.title, 'Shared Expense Split');
  const subtitle = readOptionalString(props.subtitle);
  const footerNote = readOptionalString(props.footerNote);
  const variant = readString(props.variant, 'card');
  const ctaLabel = readString(
    props.ctaLabel,
    variant === 'clipboard' ? 'Split the check' : 'Calculate split',
  );
  const currency = readString(props.currency, 'USD');
  const initGuests = readStringArray(props.guests);
  const guestCount = Math.max(2, initGuests.length);
  const presets = readNumberArray(props.tipPresets);
  const tipPresets = presets.length > 0 ? presets : [15, 18, 20, 25];

  const [guests, setGuests] = React.useState<string[]>(() =>
    initGuests.length >= 2 ? initGuests : ['Person 1', 'Person 2'],
  );

  const [items, setItems] = React.useState<LedgerItemState[]>(() => {
    const raw = readRecordArray(props.items);
    return raw.map((it, idx) => {
      const shared = new Set(readNumberArray(it.sharedBy));
      const priceNum = readNumber(it.price, 0);
      return {
        id: readString(it.id, `item-${idx + 1}`),
        name: readString(it.name),
        price: priceNum > 0 ? priceNum.toFixed(2) : '',
        selected: Array.from({ length: guestCount }, (_, gIdx) => shared.has(gIdx)),
      };
    });
  });

  const [taxMode, setTaxMode] = React.useState<'amount' | 'percent'>(
    props.taxMode === 'percent' ? 'percent' : 'amount',
  );
  const [taxInput, setTaxInput] = React.useState<string>(() => {
    const t = readNumber(props.taxAmount, 0);
    return t > 0 ? t.toFixed(2) : '0.00';
  });
  const [tipMode, setTipMode] = React.useState<'percent' | 'amount'>('percent');
  const [tipPercent, setTipPercent] = React.useState<number>(() => readNumber(props.tipPercent, 0));
  const [tipCustom, setTipCustom] = React.useState<string>('0.00');
  const [showReceipt, setShowReceipt] = React.useState<boolean>(() =>
    readBoolean(props.defaultExpandedReceipt, false),
  );

  const calc = computeLedgerSplit({
    guestCount: guests.length,
    items,
    taxMode,
    taxInput,
    tipMode,
    tipPercent,
    tipCustom,
  });

  const isValid = calc.subtotalCents > 0 && calc.unassignedIds.size === 0;
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const displayGuest = (i: number) => guests[i]?.trim() || `Person ${i + 1}`;

  const addDish = () => {
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, name: '', price: '', selected: guests.map((_, idx) => idx === 0) },
    ]);
  };

  const copySplit = async () => {
    const text = buildSplitSummaryText(title, guests, calc, currency);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Fallback via toast
    }
    emitLuminaToast('Split copied to clipboard');
  };

  return (
    <section
      className={`lumina-split-ledger is-${variant}`}
      style={weightStyle(props.weight)}
      aria-label={title}
    >
      {variant === 'clipboard' && <div className="lumina-ledger-clip" aria-hidden="true" />}

      <div className="lumina-ledger-paper">
        <header className="lumina-ledger-masthead">
          {eyebrow && <p className="lumina-ledger-eyebrow">{eyebrow}</p>}
          <h3 className="lumina-ledger-title">{title}</h3>
          {subtitle && <p className="lumina-ledger-subtitle">{subtitle}</p>}
        </header>

        <div className="lumina-ledger-section">
          <div className="lumina-ledger-sec-title">01 / Who&apos;s at the table?</div>
          <p className="lumina-ledger-hint">Give everyone a name.</p>
          <div className="lumina-ledger-guests-grid">
            {guests.map((g, idx) => (
              <label key={idx} className="lumina-ledger-field">
                <span className="lumina-ledger-guest-tag">GUEST {pad2(idx + 1)}</span>
                <input
                  type="text"
                  className="lumina-ledger-input"
                  value={g}
                  maxLength={60}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGuests((prev) => prev.map((old, i) => (i === idx ? val : old)));
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        <hr className="lumina-ledger-divider" />

        <SplitLedgerItemsSection
          items={items}
          guests={guests}
          unassignedIds={calc.unassignedIds}
          onChangeItems={setItems}
          onAddDish={addDish}
        />

        <hr className="lumina-ledger-divider" />

        <div className="lumina-ledger-section">
          <div className="lumina-ledger-sec-title">03 / Tax &amp; gratuity</div>
          <div className="lumina-ledger-rate-group">
            <span className="lumina-ledger-sub-label">Tax</span>
            <div className="lumina-ledger-mode-pills" role="radiogroup" aria-label="Tax mode">
              {(['amount', 'percent'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={taxMode === m}
                  className={`lumina-ledger-mode-pill ${taxMode === m ? 'is-active' : ''}`.trim()}
                  onClick={() => setTaxMode(m)}
                >
                  {m === 'amount' ? 'Amount $' : 'Percent %'}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              aria-label="Tax value"
              className="lumina-ledger-input lumina-tabular"
              value={taxInput}
              onChange={(e) => setTaxInput(e.target.value)}
            />
          </div>

          <div className="lumina-ledger-rate-group">
            <span className="lumina-ledger-sub-label">Tip</span>
            <div className="lumina-ledger-mode-pills" role="radiogroup" aria-label="Tip mode">
              {(['percent', 'amount'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={tipMode === m}
                  className={`lumina-ledger-mode-pill ${tipMode === m ? 'is-active' : ''}`.trim()}
                  onClick={() => setTipMode(m)}
                >
                  {m === 'percent' ? 'Percentage' : 'Custom $'}
                </button>
              ))}
            </div>

            {tipMode === 'percent' ? (
              <>
                <div className="lumina-ledger-presets">
                  {tipPresets.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      aria-pressed={tipPercent === pct}
                      className={`lumina-ledger-preset-btn lumina-tabular ${tipPercent === pct ? 'is-active' : ''}`.trim()}
                      onClick={() => setTipPercent(pct)}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <div className="lumina-ledger-tip-slider-head">
                  <span>Adjust tip</span>
                  <strong className="lumina-tabular">{tipPercent}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  aria-label="Adjust tip percentage"
                  className="lumina-ledger-range"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(Number(e.target.value))}
                />
              </>
            ) : (
              <input
                type="number"
                min="0"
                step="0.01"
                aria-label="Custom tip dollars"
                className="lumina-ledger-input lumina-tabular"
                value={tipCustom}
                onChange={(e) => setTipCustom(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="lumina-ledger-summary">
          <div className="lumina-ledger-sum-heading">BILL SUMMARY</div>
          <div className="lumina-ledger-sum-row">
            <span>Food &amp; drinks</span>
            <span className="lumina-tabular">{formatMoneyCents(calc.subtotalCents, currency)}</span>
          </div>
          <div className="lumina-ledger-sum-row">
            <span>Tax</span>
            <span className="lumina-tabular">{formatMoneyCents(calc.taxCents, currency)}</span>
          </div>
          <div className="lumina-ledger-sum-row">
            <span>Tip</span>
            <span className="lumina-tabular">{formatMoneyCents(calc.tipCents, currency)}</span>
          </div>
          <hr className="lumina-ledger-divider" />
          <div className="lumina-ledger-sum-total">
            <span>TOTAL</span>
            <span className="lumina-tabular">{formatMoneyCents(calc.totalCents, currency)}</span>
          </div>
        </div>

        <button
          type="button"
          className="lumina-ledger-split-cta"
          disabled={!isValid}
          onClick={() => setShowReceipt(true)}
        >
          <span>{ctaLabel}</span>
          <ArrowRight size={15} />
        </button>

        {showReceipt && isValid && (
          <div className="lumina-ledger-receipt" aria-label="Final receipt">
            <div className="lumina-ledger-receipt-head">
              <span className="lumina-ledger-eyebrow">FINAL RECEIPT</span>
              <h4>Everyone&apos;s share</h4>
            </div>
            <div className="lumina-ledger-shares">
              {calc.sharesCents.map((amt, i) => (
                <div key={i} className="lumina-ledger-person">
                  <div className="lumina-ledger-sum-row">
                    <strong>{displayGuest(i)}</strong>
                    <strong className="lumina-tabular">{formatMoneyCents(amt, currency)}</strong>
                  </div>
                  <div className="lumina-ledger-person-sub lumina-tabular">
                    Food {formatMoneyCents(calc.foodCents[i] ?? 0, currency)} · Tax{' '}
                    {formatMoneyCents(calc.taxesCents[i] ?? 0, currency)} · Tip{' '}
                    {formatMoneyCents(calc.tipsCents[i] ?? 0, currency)}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="lumina-ledger-pill-btn" onClick={copySplit}>
              <Copy size={14} />
              <span>Copy split</span>
            </button>
            <p className="lumina-ledger-receipt-note">
              Tax and tip are allocated proportionally to each person&apos;s food and drinks.
              Rounding is balanced to the cent so all shares add up to the bill.
            </p>
          </div>
        )}

        {footerNote && <p className="lumina-ledger-footer">{footerNote}</p>}
      </div>
    </section>
  );
}

export interface LedgerItemState {
  id: string;
  name: string;
  price: string;
  selected: boolean[];
}

export interface SplitComputation {
  subtotalCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  unassignedIds: Set<string>;
  foodCents: number[];
  taxesCents: number[];
  tipsCents: number[];
  sharesCents: number[];
}

export function toCents(val: string | number): number {
  const n = Number(val);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round((n + Number.EPSILON) * 100);
}

export function formatMoneyCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(cents / 100);
}

export function allocateLargestRemainder(totalCents: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!sum || !totalCents) return weights.map(() => 0);
  const exact = weights.map((w) => (totalCents * w) / sum);
  const floored = exact.map((v) => Math.floor(v));
  const remaining = totalCents - floored.reduce((a, b) => a + b, 0);
  const order = exact
    .map((v, i) => ({ i, rem: v - (floored[i] ?? 0) }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);
  const out = [...floored];
  for (let j = 0; j < remaining; j++) {
    const slot = order[j % order.length];
    if (slot !== undefined) {
      out[slot.i] = (out[slot.i] ?? 0) + 1;
    }
  }
  return out;
}

export function computeLedgerSplit(opts: {
  guestCount: number;
  items: LedgerItemState[];
  taxMode: 'amount' | 'percent';
  taxInput: string;
  tipMode: 'percent' | 'amount';
  tipPercent: number;
  tipCustom: string;
}): SplitComputation {
  const weights = new Array<number>(opts.guestCount).fill(0);
  const unassignedIds = new Set<string>();
  let subtotalCents = 0;

  for (const item of opts.items) {
    const cost = toCents(item.price);
    subtotalCents += cost;
    const diners: number[] = [];
    item.selected.forEach((on, idx) => {
      if (on && idx < opts.guestCount) diners.push(idx);
    });
    if (cost > 0 && diners.length === 0) {
      unassignedIds.add(item.id);
    }
    for (const d of diners) {
      weights[d] = (weights[d] ?? 0) + cost / diners.length;
    }
  }

  const taxNum = Math.max(0, Number(opts.taxInput) || 0);
  const taxCents =
    opts.taxMode === 'percent' ? Math.round((subtotalCents * taxNum) / 100) : toCents(opts.taxInput);
  const tipCents =
    opts.tipMode === 'percent'
      ? Math.round((subtotalCents * Math.max(0, opts.tipPercent)) / 100)
      : toCents(opts.tipCustom);

  const foodCents = allocateLargestRemainder(subtotalCents, weights);
  const taxesCents = allocateLargestRemainder(taxCents, weights);
  const tipsCents = allocateLargestRemainder(tipCents, weights);
  const sharesCents = foodCents.map((f, i) => f + (taxesCents[i] ?? 0) + (tipsCents[i] ?? 0));

  return {
    subtotalCents,
    taxCents,
    tipCents,
    totalCents: subtotalCents + taxCents + tipCents,
    unassignedIds,
    foodCents,
    taxesCents,
    tipsCents,
    sharesCents,
  };
}

export function buildSplitSummaryText(
  title: string,
  guests: string[],
  calc: SplitComputation,
  currency: string,
): string {
  const lines = [
    title.toUpperCase(),
    "Everyone's share",
    '',
    ...calc.sharesCents.map((amt, i) => {
      const name = guests[i]?.trim() || `Person ${i + 1}`;
      return `${name}: ${formatMoneyCents(amt, currency)} (Food ${formatMoneyCents(calc.foodCents[i] ?? 0, currency)} · Tax ${formatMoneyCents(calc.taxesCents[i] ?? 0, currency)} · Tip ${formatMoneyCents(calc.tipsCents[i] ?? 0, currency)})`;
    }),
    '',
    `Food & drinks: ${formatMoneyCents(calc.subtotalCents, currency)}`,
    `Tax: ${formatMoneyCents(calc.taxCents, currency)}`,
    `Tip: ${formatMoneyCents(calc.tipCents, currency)}`,
    `TOTAL: ${formatMoneyCents(calc.totalCents, currency)}`,
  ];
  return lines.join('\n');
}

import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { CompoundGrowthApi, ComputeMathApi } from './schema.js';

function numOr(val: unknown, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export const ComputeMathImplementation = createFunctionImplementation(ComputeMathApi, (args) => {
  const a = numOr(args.a, 0);
  const b = numOr(args.b, 0);
  const c = numOr(args.c, 0);
  const d = numOr(args.d, 0);
  let raw = 0;

  switch (args.op) {
    case 'add':
      raw = a + b;
      break;
    case 'sub':
      raw = a - b;
      break;
    case 'mul':
      raw = a * b;
      break;
    case 'div':
      raw = b === 0 ? 0 : a / b;
      break;
    case 'round':
      raw = Math.round(a);
      break;
    case 'ceil':
      raw = Math.ceil(a);
      break;
    case 'floor':
      raw = Math.floor(a);
      break;
    case 'clamp': {
      const lo = Math.min(b, c);
      const hi = Math.max(b, c);
      raw = Math.min(hi, Math.max(lo, a));
      break;
    }
    case 'abs':
      raw = Math.abs(a);
      break;
    case 'percentOf':
      raw = b === 0 ? 0 : (a / b) * 100;
      break;
    case 'sum':
      raw = a + b + c + d;
      break;
  }

  if (args.decimals !== undefined) {
    const dec = Math.max(0, Math.min(6, Math.floor(numOr(args.decimals, 0))));
    const factor = 10 ** dec;
    return Math.round((raw + Number.EPSILON) * factor) / factor;
  }
  return raw;
});

export const CompoundGrowthImplementation = createFunctionImplementation(
  CompoundGrowthApi,
  (args) => {
    const initial = Math.max(0, numOr(args.initial, 0));
    const monthly = Math.max(0, numOr(args.monthly, 0));
    const years = Math.max(0, numOr(args.years, 0));
    const annualPercent = Math.max(0, numOr(args.annualRate, 0));
    const months = years * 12;
    const monthlyRate = annualPercent / 1200;
    const contributions = initial + monthly * months;

    const total =
      monthlyRate === 0
        ? contributions
        : initial * Math.exp(months * Math.log1p(monthlyRate)) +
          (monthly * Math.expm1(months * Math.log1p(monthlyRate))) / monthlyRate;
    const growth = Math.max(0, total - contributions);

    if (args.metric === 'contributions') return Math.round(contributions);
    if (args.metric === 'growth') return Math.round(growth);
    return Math.round(total);
  },
);

export const computeMathSlice = defineCatalogFunction({
  slug: 'compute-math',
  implementations: [ComputeMathImplementation, CompoundGrowthImplementation],
});

export { CompoundGrowthApi, ComputeMathApi };

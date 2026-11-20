import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { SampleDistributionApi, SelectByValueApi } from './schema.js';
import {
  buildHistogram,
  computeStats,
  emptySampleState,
  sampleFromDistribution,
} from './sim-engine.js';

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function toNumArray(val: unknown): number[] {
  if (!Array.isArray(val)) return [];
  return val.map((x) => Number(x)).filter((x) => Number.isFinite(x));
}

export const SelectByValueImplementation = createFunctionImplementation(
  SelectByValueApi,
  (args) => {
    const val = args.value;
    if (args.whenNegative !== undefined || args.whenNonNegative !== undefined) {
      const n = Number(val);
      if (Number.isFinite(n) && n < 0) {
        return args.whenNegative ?? args.fallback ?? '';
      }
      return args.whenNonNegative ?? args.fallback ?? '';
    }
    const key = val === null || val === undefined ? '' : String(val);
    if (isRecord(args.cases) && Object.prototype.hasOwnProperty.call(args.cases, key)) {
      return args.cases[key];
    }
    return args.fallback ?? null;
  },
);

export const SampleDistributionImplementation = createFunctionImplementation(
  SampleDistributionApi,
  (args, context) => {
    const targetPath = String(args.path ?? '');
    if (!targetPath) return;
    const binCount = Math.max(4, Math.min(32, Math.round(Number(args.bins ?? 14))));

    if (args.action === 'reset') {
      context.set(targetPath, emptySampleState(binCount));
      return;
    }

    const prevRaw = context.resolveDynamicValue<unknown>({ '@path': targetPath });
    const prev = isRecord(prevRaw) ? prevRaw : {};
    const dist = String(args.distribution ?? 'uniform');
    const n = Math.max(1, Math.min(100, Math.round(Number(args.sampleSize ?? 1))));
    const draws = Math.max(1, Math.min(2000, Math.round(Number(args.count ?? 100))));
    const existing = toNumArray(prev.values);
    const added: number[] = [];

    for (let s = 0; s < draws; s++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += sampleFromDistribution(dist, Math.random(), Math.random());
      }
      added.push(sum / n);
    }

    const combined = [...existing, ...added].slice(-5000);
    const stats = computeStats(combined);
    context.set(targetPath, {
      values: combined,
      bins: buildHistogram(combined, binCount),
      count: stats.count.toLocaleString('en-US'),
      mean: stats.mean,
      stdev: stats.stdev,
    });
  },
);

export const selectByValueSlice = defineCatalogFunction({
  slug: 'select-by-value',
  implementations: [SelectByValueImplementation, SampleDistributionImplementation],
});

export { SampleDistributionApi, SelectByValueApi };

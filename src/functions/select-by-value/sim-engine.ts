export interface HistogramBin {
  bin: string;
  count: number;
}

export function sampleFromDistribution(dist: string, u: number, u2: number): number {
  const key = dist.trim().toLowerCase();
  if (key === 'skewed') return u * u * u;
  if (key === 'bimodal') return u < 0.5 ? 0.08 + 0.36 * u : 0.56 + 0.36 * u;
  if (key === 'normal') {
    const safeU1 = Math.max(1e-7, u);
    const z = Math.sqrt(-2 * Math.log(safeU1)) * Math.cos(2 * Math.PI * u2);
    return Math.max(0, Math.min(0.9999, 0.5 + z * 0.16));
  }
  return u;
}

export function buildHistogram(values: number[], binCount = 14): HistogramBin[] {
  const k = Math.max(4, Math.min(32, Math.round(binCount)));
  const counts = new Array<number>(k).fill(0);
  for (const v of values) {
    const idx = Math.min(k - 1, Math.max(0, Math.floor(v * k)));
    counts[idx] = (counts[idx] ?? 0) + 1;
  }
  return counts.map((count, i) => ({
    bin: ((i + 0.5) / k).toFixed(2),
    count,
  }));
}

export function computeStats(values: number[]): { count: number; mean: string; stdev: string } {
  if (values.length === 0) {
    return { count: 0, mean: '—', stdev: '—' };
  }
  const mean = values.reduce((acc, x) => acc + x, 0) / values.length;
  const variance =
    values.reduce((acc, x) => acc + (x - mean) * (x - mean), 0) / Math.max(1, values.length);
  return {
    count: values.length,
    mean: mean.toFixed(3),
    stdev: Math.sqrt(variance).toFixed(3),
  };
}

export function emptySampleState(binCount = 14) {
  const values: number[] = [];
  return {
    values,
    bins: buildHistogram([], binCount),
    count: '0',
    mean: '—',
    stdev: '—',
  };
}

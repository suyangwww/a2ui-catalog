export interface HistogramBin {
  bin: string;
  count: number;
}

export function sampleFromDistribution(dist: string, u: number): number {
  if (dist === 'Skewed') return u * u * u;
  if (dist === 'Bimodal') return u < 0.5 ? 0.08 + 0.36 * u : 0.56 + 0.36 * u;
  return u;
}

export function buildPopulationHistogram(dist: string, bins = 16): HistogramBin[] {
  const counts = new Array<number>(bins).fill(0);
  const total = 400;
  for (let i = 0; i < total; i++) {
    const u = (i + 0.5) / total;
    const v = sampleFromDistribution(dist, u);
    const idx = Math.min(bins - 1, Math.max(0, Math.floor(v * bins)));
    counts[idx] = (counts[idx] ?? 0) + 1;
  }
  return counts.map((count, i) => ({
    bin: ((i + 0.5) / bins).toFixed(2),
    count,
  }));
}

export function buildHistogram(values: number[], bins = 16): HistogramBin[] {
  const counts = new Array<number>(bins).fill(0);
  for (const v of values) {
    const idx = Math.min(bins - 1, Math.max(0, Math.floor(v * bins)));
    counts[idx] = (counts[idx] ?? 0) + 1;
  }
  return counts.map((count, i) => ({
    bin: ((i + 0.5) / bins).toFixed(2),
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

export function initialCltState(dist = 'Skewed', sampleSize = 5) {
  const means: number[] = [];
  return {
    means,
    populationBins: buildPopulationHistogram(dist),
    sampleBins: buildHistogram([]),
    sampleCount: '0',
    meanOfMeans: '—',
    spreadOfMeans: '—',
    theorySpread: (0.28 / Math.sqrt(Math.max(1, sampleSize))).toFixed(3),
  };
}

export function initialMontyState() {
  return {
    choice: -1,
    opened: -1,
    finalDoor: -1,
    prize: 1,
    statusTitle: 'Start by choosing a door',
    statusBody: 'One car, two goats. The host knows where the car is and opens a goat door.',
    switchedGames: 0,
    switchWins: 0,
    stayedGames: 0,
    stayWins: 0,
    simGames: 1000,
    chartData: [
      { strategy: 'Stay (1/3)', winPct: 33.3 },
      { strategy: 'Switch (2/3)', winPct: 66.7 },
    ],
  };
}

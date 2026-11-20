import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { RunSimulationApi, SelectByValueApi } from './schema.js';
import {
  buildHistogram,
  buildPopulationHistogram,
  computeStats,
  initialCltState,
  initialMontyState,
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

export const RunSimulationImplementation = createFunctionImplementation(
  RunSimulationApi,
  (args, context) => {
    const targetPath = String(args.path ?? '');
    if (!targetPath) return;
    const prevRaw = context.resolveDynamicValue<unknown>({ '@path': targetPath });
    const prev = isRecord(prevRaw) ? prevRaw : {};

    if (args.mode === 'cltReset') {
      const dist = String(args.distribution ?? 'Skewed');
      const n = Math.max(1, Math.round(Number(args.sampleSize ?? 5)));
      context.set(targetPath, initialCltState(dist, n));
      return;
    }

    if (args.mode === 'cltDraw') {
      const dist = String(args.distribution ?? 'Skewed');
      const n = Math.max(1, Math.min(80, Math.round(Number(args.sampleSize ?? 5))));
      const draws = Math.max(1, Math.min(1000, Math.round(Number(args.count ?? 100))));
      const existing = toNumArray(prev.means);
      const added: number[] = [];
      for (let s = 0; s < draws; s++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += sampleFromDistribution(dist, Math.random());
        }
        added.push(sum / n);
      }
      const combined = [...existing, ...added].slice(-4000);
      const stats = computeStats(combined);
      const popStdev = dist === 'Skewed' ? 0.257 : dist === 'Bimodal' ? 0.262 : 0.289;
      context.set(targetPath, {
        means: combined,
        populationBins: buildPopulationHistogram(dist),
        sampleBins: buildHistogram(combined),
        sampleCount: stats.count.toLocaleString('en-US'),
        meanOfMeans: stats.mean,
        spreadOfMeans: stats.stdev,
        theorySpread: (popStdev / Math.sqrt(n)).toFixed(3),
      });
      return;
    }

    if (args.mode === 'montyReset') {
      context.set(targetPath, {
        ...initialMontyState(),
        switchedGames: Number(prev.switchedGames ?? 0),
        switchWins: Number(prev.switchWins ?? 0),
        stayedGames: Number(prev.stayedGames ?? 0),
        stayWins: Number(prev.stayWins ?? 0),
        simGames: Number(prev.simGames ?? 1000),
        chartData: Array.isArray(prev.chartData) ? prev.chartData : initialMontyState().chartData,
      });
      return;
    }

    if (args.mode === 'montyPick') {
      const door = Math.max(0, Math.min(2, Math.round(Number(args.door ?? 0))));
      const prize = Math.floor(Math.random() * 3);
      const opened =
        prize === door ? (door + 1 + Math.floor(Math.random() * 2)) % 3 : 3 - door - prize;
      context.set(targetPath, {
        ...initialMontyState(),
        ...prev,
        choice: door,
        prize,
        opened,
        finalDoor: -1,
        statusTitle: `Door ${opened + 1} reveals a goat!`,
        statusBody: `Door ${door + 1} still holds a 1/3 chance. Switching to Door ${3 - door - opened + 1} concentrates the remaining 2/3 chance.`,
      });
      return;
    }

    if (args.mode === 'montyResolve') {
      const choice = Number(prev.choice ?? 0);
      const opened = Number(prev.opened ?? 1);
      const prize = Number(prev.prize ?? 2);
      if (choice < 0) return;
      const didSwitch = args.strategy === 'switch';
      const finalDoor = didSwitch ? 3 - choice - opened : choice;
      const won = finalDoor === prize;
      const switchedGames = Number(prev.switchedGames ?? 0) + (didSwitch ? 1 : 0);
      const switchWins = Number(prev.switchWins ?? 0) + (didSwitch && won ? 1 : 0);
      const stayedGames = Number(prev.stayedGames ?? 0) + (!didSwitch ? 1 : 0);
      const stayWins = Number(prev.stayWins ?? 0) + (!didSwitch && won ? 1 : 0);
      context.set(targetPath, {
        ...prev,
        finalDoor,
        switchedGames,
        switchWins,
        stayedGames,
        stayWins,
        statusTitle: won ? 'You won the car!' : 'A goat behind this door.',
        statusBody: `Switching wins 2 out of 3 rounds over time. Your record — Switch: ${switchWins}/${switchedGames}, Stay: ${stayWins}/${stayedGames}.`,
      });
      return;
    }

    if (args.mode === 'montySim') {
      const batch = Math.max(100, Math.min(5000, Math.round(Number(args.count ?? 1000))));
      let stayHits = 0;
      for (let i = 0; i < batch; i++) {
        const p = Math.floor(Math.random() * 3);
        const c = Math.floor(Math.random() * 3);
        if (p === c) stayHits++;
      }
      const stayPct = Math.round((stayHits / batch) * 1000) / 10;
      const switchPct = Math.round((100 - stayPct) * 10) / 10;
      const totalSim = Number(prev.simGames ?? 0) + batch;
      context.set(targetPath, {
        ...initialMontyState(),
        ...prev,
        simGames: totalSim,
        statusTitle: `Simulated ${totalSim.toLocaleString('en-US')} rounds`,
        statusBody: `Stay won ${stayPct}% vs Switch winning ${switchPct}% — converging cleanly on 33.3% vs 66.7%.`,
        chartData: [
          { strategy: 'Stay (1/3)', winPct: stayPct },
          { strategy: 'Switch (2/3)', winPct: switchPct },
        ],
      });
    }
  },
);

export const selectByValueSlice = defineCatalogFunction({
  slug: 'select-by-value',
  implementations: [SelectByValueImplementation, RunSimulationImplementation],
});

export { RunSimulationApi, SelectByValueApi };

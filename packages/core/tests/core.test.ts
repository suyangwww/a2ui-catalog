import { describe, expect, it } from 'vitest';
import {
  LUMINA_COMPONENT_APIS,
  LUMINA_FUNCTIONS,
  LUMINA_V1_CATALOG_ID,
  createLuminaCatalogSlice,
  luminaCoreCatalog,
  FormatCompactNumberImplementation,
  FormatPercentImplementation,
  FormatRelativeTimeImplementation,
  SetValueImplementation,
  subscribeLuminaToasts,
  CompoundGrowthImplementation,
  ComputeMathImplementation,
  CopyToClipboardImplementation,
  SelectByValueImplementation,
} from '../src/index.js';
import { DataContext, DataModel } from '@a2ui/web_core';

describe('@a2ui-catalog/core', () => {
  it('registers all 49 components and 24 functions under A2UI v1.0', () => {
    expect(LUMINA_COMPONENT_APIS).toHaveLength(49);
    // 14 Basic + @index system function + 10 Lumina functions
    expect(LUMINA_FUNCTIONS.filter((f) => !f.name.startsWith('@'))).toHaveLength(24);
    expect(luminaCoreCatalog.id).toBe(LUMINA_V1_CATALOG_ID);
    expect(luminaCoreCatalog.protocolVersion).toBe('1.0');
    expect(luminaCoreCatalog.components.size).toBe(49);
    expect(Object.keys((luminaCoreCatalog.toJson() as { functions: Record<string, unknown> }).functions)).toHaveLength(24);
  });

  it('produces valid domain profile slices via Catalog.copyWith', () => {
    const research = createLuminaCatalogSlice(luminaCoreCatalog, 'research');
    const devops = createLuminaCatalogSlice(luminaCoreCatalog, 'devops');
    expect(research.components.has('SourceList')).toBe(true);
    expect(research.components.has('Chart')).toBe(true);
    expect(research.components.has('AnnotatedDiagram')).toBe(true);
    expect(research.components.has('DiffViewer')).toBe(false);
    expect(devops.components.has('DiffViewer')).toBe(true);
    expect(devops.components.has('ApprovalCard')).toBe(true);
    expect(devops.components.has('Carousel')).toBe(false);
  });

  it('executes custom Lumina functions accurately', () => {
    const dm = new DataModel({ count: 0 });
    const ctx = new DataContext(dm, '/');

    expect(FormatCompactNumberImplementation.execute({ value: 1420000, decimals: 1 }, ctx)).toBe('1.4M');
    expect(
      FormatPercentImplementation.execute({ value: 0.124, decimals: 1, signDisplay: 'always' }, ctx),
    ).toBe('+12.4%');

    const twoMinsAgo = new Date(Date.now() - 120_000).toISOString();
    expect(String(FormatRelativeTimeImplementation.execute({ value: twoMinsAgo }, ctx))).toContain('2');

    SetValueImplementation.execute({ path: '/count', value: 42 }, ctx);
    expect(dm.get('/count')).toBe(42);

    expect(ComputeMathImplementation.execute({ op: 'mul', a: 125, b: 1.5 }, ctx)).toBe(187.5);
    expect(
      CompoundGrowthImplementation.execute(
        { initial: 0, monthly: 500, years: 30, annualRate: 5, metric: 'total' },
        ctx,
      ),
    ).toBe(416129);
    expect(
      SelectByValueImplementation.execute(
        { value: -1, whenNegative: 'Deficit', whenNonNegative: 'Surplus' },
        ctx,
      ),
    ).toBe('Deficit');

    const toasts: string[] = [];
    const unsub = subscribeLuminaToasts((msg) => toasts.push(msg));
    CopyToClipboardImplementation.execute({ text: 'LUM-8842K', label: 'Copied PNR' }, ctx);
    unsub();
    expect(toasts).toEqual(['Copied PNR']);
  });
});

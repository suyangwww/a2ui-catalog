import React from 'react';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MessageProcessor } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import { LUMINA_V1_CATALOG_ID, processLuminaMessages } from '@a2ui-catalog/core';
import { LuminaProvider, LuminaSurface, luminaReactCatalog } from '../src/index.js';

afterEach(() => cleanup());

function renderLumina(
  messages: unknown[],
  options?: {
    viewport?: 'auto' | 'desktop' | 'mobile';
    onAction?: (action: unknown) => void;
    onOpenArtifact?: (req: unknown) => void;
  },
) {
  const actions: unknown[] = [];
  const processor = new MessageProcessor<ReactCatalogComponent>(
    [luminaReactCatalog],
    (action) => {
      actions.push(action);
      options?.onAction?.(action);
    },
  );
  processLuminaMessages(processor, messages);
  const surface = Array.from(processor.model.surfacesMap.values())[0]!;
  const view = render(
    <LuminaProvider
      theme="light"
      viewport={options?.viewport ?? 'desktop'}
      onOpenArtifact={options?.onOpenArtifact as never}
    >
      <LuminaSurface surface={surface} />
    </LuminaProvider>,
  );
  return { ...view, processor, surface, actions };
}

describe('Lumina React Renderer — Agentic Components & Interactions', () => {
  it('renders ThoughtTrace, StepTimeline, ProgressIndicator, SourceList, Callout, and StatMetric', async () => {
    const { container } = renderLumina([
      {
        version: '1.0',
        createSurface: {
          surfaceId: 's-research',
          catalogId: LUMINA_V1_CATALOG_ID,
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['thought', 'timeline', 'progress', 'sources', 'callout', 'grid'],
            },
            {
              id: 'thought',
              component: 'ThoughtTrace',
              summary: 'Thought for 4.2s · Synthesized Q3 filings',
              status: 'complete',
              durationSeconds: 4.2,
              steps: [{ title: 'Fetched 5 sources', detail: 'Parsed revenue tables' }],
            },
            {
              id: 'timeline',
              component: 'StepTimeline',
              title: 'Research Execution',
              steps: [
                { id: '1', title: 'Query SEC Filings', status: 'completed', timestamp: '0.8s' },
                { id: '2', title: 'Synthesize Margins', status: 'active', timestamp: '1.4s' },
              ],
            },
            {
              id: 'progress',
              component: 'ProgressIndicator',
              label: 'Indexing sources',
              value: 75,
              variant: 'segmented',
              segments: 4,
            },
            {
              id: 'sources',
              component: 'SourceList',
              title: 'Grounded Citations',
              sources: [
                { id: 's1', title: 'Q3 Earnings Release', url: 'https://example.com/q3', index: 1 },
              ],
            },
            {
              id: 'callout',
              component: 'Callout',
              title: 'Key Finding',
              body: 'Data-center gross margins expanded +420 bps YoY.',
              tone: 'tip',
            },
            {
              id: 'grid',
              component: 'Grid',
              columns: 2,
              children: ['m1', 'm2'],
            },
            {
              id: 'm1',
              component: 'StatMetric',
              label: 'Quarterly Revenue',
              value: { '@call': 'formatCurrency', args: { value: { '@path': '/rev' }, currency: 'USD' } },
              delta: '+18.4%',
              trend: 'up',
              sparkline: [22, 26, 29, 35, 41],
            },
            {
              id: 'm2',
              component: 'StatMetric',
              label: 'P99 Latency',
              value: '42ms',
              delta: '-38%',
              trend: 'down',
              trendSentiment: 'positive',
            },
          ],
          dataModel: { rev: 41200000 },
        },
      },
    ]);

    await waitFor(() => {
      expect(container.textContent).toContain('Thought for 4.2s');
      expect(container.textContent).toContain('Query SEC Filings');
      expect(container.textContent).toContain('Q3 Earnings Release');
      expect(container.textContent).toContain('Key Finding');
      expect(container.textContent).toContain('$41,200,000.00');
      expect(container.textContent).toContain('42ms');
    });

    // Expand ThoughtTrace
    fireEvent.click(container.querySelector('.lumina-thought-trigger')!);
    await waitFor(() => expect(container.textContent).toContain('Fetched 5 sources'));
  });

  it('supports reactive StepperInput, Switch, SegmentedControl, and @checks-gated ApprovalCard', async () => {
    const onAction = vi.fn();
    const { container, surface } = renderLumina(
      [
        {
          version: '1.0',
          createSurface: {
            surfaceId: 's-hitl',
            catalogId: LUMINA_V1_CATALOG_ID,
            components: [
              {
                id: 'root',
                component: 'Column',
                children: ['seg', 'stepper', 'sw', 'approval'],
              },
              {
                id: 'seg',
                component: 'SegmentedControl',
                label: 'Cabin',
                value: { '@path': '/cabin' },
                options: [
                  { label: 'Business', value: 'business' },
                  { label: 'First', value: 'first' },
                ],
              },
              {
                id: 'stepper',
                component: 'StepperInput',
                label: 'Travelers',
                value: { '@path': '/travelers' },
                min: 1,
                max: 6,
              },
              {
                id: 'sw',
                component: 'Switch',
                label: 'Airport Transfer',
                value: { '@path': '/transfer' },
              },
              {
                id: 'approval',
                component: 'ApprovalCard',
                title: 'Approve Production Rollout',
                riskLevel: 'high',
                details: 'confirm_box',
                approveLabel: 'Approve Rollout',
                approveAction: {
                  event: { name: 'approve_rollout', context: { travelers: { '@path': '/travelers' } } },
                },
                '@checks': [
                  {
                    condition: { '@path': '/confirmed' },
                    message: 'Please verify staging canary metrics first.',
                  },
                ],
              },
              {
                id: 'confirm_box',
                component: 'CheckBox',
                label: 'I verified staging canary metrics',
                value: { '@path': '/confirmed' },
              },
            ],
            dataModel: {
              cabin: 'business',
              travelers: 2,
              transfer: false,
              confirmed: false,
            },
          },
        },
      ],
      { onAction },
    );

    await waitFor(() => expect(container.textContent).toContain('Approve Production Rollout'));

    // Increment StepperInput -> updates DataModel reactively
    fireEvent.click(container.querySelector('button[aria-label="Increase Travelers"]')!);
    expect(surface.dataModel.get('/travelers')).toBe(3);

    // Toggle Switch
    fireEvent.click(container.querySelector('button[role="switch"]')!);
    expect(surface.dataModel.get('/transfer')).toBe(true);

    // Select First segment
    const firstRadio = Array.from(container.querySelectorAll('button[role="radio"]')).find(
      (b) => b.textContent?.includes('First'),
    )!;
    fireEvent.click(firstRadio);
    expect(surface.dataModel.get('/cabin')).toBe('first');

    // ApprovalCard button is disabled until @checks condition (/confirmed) is true!
    const approveBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Approve Rollout'),
    ) as HTMLButtonElement;
    expect(approveBtn.disabled).toBe(true);
    expect(container.textContent).toContain('Please verify staging canary metrics first.');

    // Check confirmation checkbox -> unlocks ApprovalCard -> dispatches action!
    fireEvent.click(container.querySelector('input[type="checkbox"]')!);
    await waitFor(() => expect(approveBtn.disabled).toBe(false));

    fireEvent.click(approveBtn);
    await waitFor(() => {
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(container.textContent).toContain('Approved and dispatched to agent');
    });
  });

  it('renders CodeBlock, DiffViewer, ArtifactCard, Chart, DataTable, KeyValueList, ComparisonMatrix (mobile), and FollowUpSuggestions', async () => {
    const onOpenArtifact = vi.fn();
    const onAction = vi.fn();
    const { container } = renderLumina(
      [
        {
          version: '1.0',
          createSurface: {
            surfaceId: 's-rich',
            catalogId: LUMINA_V1_CATALOG_ID,
            components: [
              {
                id: 'root',
                component: 'Column',
                children: ['code', 'diff', 'artifact', 'chart', 'table', 'kv', 'compare', 'followups'],
              },
              {
                id: 'code',
                component: 'CodeBlock',
                filename: 'pool.sql',
                language: 'sql',
                code: 'SELECT count(*) FROM pg_stat_activity;\n',
              },
              {
                id: 'diff',
                component: 'DiffViewer',
                filename: 'pool.yaml',
                before: 'max_connections: 25\ntimeout_ms: 1500\n',
                after: 'max_connections: 80\ntimeout_ms: 3000\n',
                viewMode: 'split',
              },
              {
                id: 'artifact',
                component: 'ArtifactCard',
                title: 'Executive Memo',
                kind: 'report',
                version: 'v2',
                preview: 'Summary of Q3 semiconductor supply chain.',
                child: 'artifact_body',
              },
              {
                id: 'artifact_body',
                component: 'Text',
                text: 'Full report content inside Canvas.',
              },
              {
                id: 'chart',
                component: 'Chart',
                type: 'area',
                title: 'Quarterly Revenue',
                xKey: 'q',
                series: [{ key: 'rev', label: 'Revenue', color: 'blue' }],
                data: [
                  { q: 'Q1', rev: 18 },
                  { q: 'Q2', rev: 24 },
                  { q: 'Q3', rev: 32 },
                ],
              },
              {
                id: 'table',
                component: 'DataTable',
                caption: 'Segments',
                columns: [
                  { key: 'name', header: 'Segment' },
                  { key: 'rev', header: 'Revenue', format: 'currency', align: 'end' },
                ],
                rows: [
                  { id: '1', name: 'Compute', rev: 28000 },
                  { id: '2', name: 'Networking', rev: 14000 },
                ],
              },
              {
                id: 'kv',
                component: 'KeyValueList',
                title: 'Booking Receipt',
                items: [{ label: 'PNR', value: 'LUM-8842K', copyable: true, mono: true }],
              },
              {
                id: 'compare',
                component: 'ComparisonMatrix',
                criteria: [{ key: 'duration', label: 'Duration' }],
                options: [
                  { id: 'nh', title: 'ANA NH 105', recommended: true, values: { duration: '11h 15m' } },
                  { id: 'jl', title: 'JAL JL 005', values: { duration: '11h 40m' } },
                ],
              },
              {
                id: 'followups',
                component: 'FollowUpSuggestions',
                suggestions: [
                  { label: 'Compare hotels', action: { event: { name: 'compare_hotels' } } },
                ],
              },
            ],
          },
        },
      ],
      { viewport: 'mobile', onOpenArtifact, onAction },
    );

    await waitFor(() => {
      expect(container.textContent).toContain('pool.sql');
      expect(container.textContent).toContain('max_connections: 80');
      expect(container.textContent).toContain('Executive Memo');
      expect(container.textContent).toContain('Quarterly Revenue');
      expect(container.textContent).toContain('$28,000');
      expect(container.textContent).toContain('LUM-8842K');
      // On mobile viewport, ComparisonMatrix uses swipeable mobile cards!
      expect(container.querySelector('.lumina-compare-mobile-rail')).toBeTruthy();
    });

    // Clicking ArtifactCard delegates to host Canvas drawer callback
    fireEvent.click(container.querySelector('.lumina-artifact-card')!);
    expect(onOpenArtifact).toHaveBeenCalledTimes(1);

    // Clicking FollowUpSuggestions pill dispatches event
    fireEvent.click(container.querySelector('.lumina-followup-pill')!);
    await waitFor(() => expect(onAction).toHaveBeenCalledTimes(1));
  });

  it('renders and reacts across Intelligent UI slices (ProportionBar, compoundGrowth, ChecklistCard, SwatchPicker, QuizCard, AnnotatedDiagram, RouteMap, SplitLedger, MicroApp)', async () => {
    const { container, surface } = renderLumina([
      {
        version: '1.0',
        createSurface: {
          surfaceId: 's-intelligent-ui',
          catalogId: LUMINA_V1_CATALOG_ID,
          dataModel: {
            monthly: 500,
            years: 30,
            rate: 5,
            done: ['c1'],
            swatch: 'sage',
          },
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['slider', 'propbar', 'checklist', 'swatches', 'quiz', 'diagram', 'map', 'ledger', 'arcade'],
            },
            {
              id: 'slider',
              component: 'Slider',
              label: 'Monthly contribution',
              min: 0,
              max: 1000,
              step: 25,
              valuePrefix: '$',
              value: { '@path': '/monthly' },
              marks: [
                { value: 0, label: '$0' },
                { value: 500, label: '$500' },
                { value: 1000, label: '$1,000' },
              ],
            },
            {
              id: 'propbar',
              component: 'ProportionBar',
              variant: 'split',
              segments: [
                {
                  id: 'contrib',
                  label: 'Contributions',
                  value: {
                    '@call': 'compoundGrowth',
                    args: { initial: 0, monthly: { '@path': '/monthly' }, years: { '@path': '/years' }, annualRate: { '@path': '/rate' }, metric: 'contributions' },
                  },
                  formattedValue: {
                    '@call': 'formatCurrency',
                    args: {
                      value: {
                        '@call': 'compoundGrowth',
                        args: { initial: 0, monthly: { '@path': '/monthly' }, years: { '@path': '/years' }, annualRate: { '@path': '/rate' }, metric: 'contributions' },
                      },
                      currency: 'USD',
                      decimals: 0,
                    },
                  },
                  color: 'slate',
                },
                {
                  id: 'growth',
                  label: 'Investment growth',
                  value: {
                    '@call': 'compoundGrowth',
                    args: { initial: 0, monthly: { '@path': '/monthly' }, years: { '@path': '/years' }, annualRate: { '@path': '/rate' }, metric: 'growth' },
                  },
                  formattedValue: {
                    '@call': 'formatCurrency',
                    args: {
                      value: {
                        '@call': 'compoundGrowth',
                        args: { initial: 0, monthly: { '@path': '/monthly' }, years: { '@path': '/years' }, annualRate: { '@path': '/rate' }, metric: 'growth' },
                      },
                      currency: 'USD',
                      decimals: 0,
                    },
                  },
                  color: 'emerald',
                },
              ],
            },
            {
              id: 'checklist',
              component: 'ChecklistCard',
              title: 'Lamb Roast Steps',
              value: { '@path': '/done' },
              items: [
                { id: 'c1', title: 'Temper lamb leg', time: '-45m' },
                { id: 'c2', title: 'Roast at 200C', time: '1h 15m' },
              ],
            },
            {
              id: 'swatches',
              component: 'SwatchPicker',
              label: 'Ripstop Palette',
              value: { '@path': '/swatch' },
              swatches: [
                { value: 'sage', label: 'Alpine Sage', hex: '#4B6B58' },
                { value: 'ochre', label: 'Signal Ochre', hex: '#D97706' },
              ],
            },
            {
              id: 'quiz',
              component: 'QuizCard',
              title: 'Quick Check',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Which term represents Net Exports?',
                  correctOptionId: 'nx',
                  options: [
                    { id: 'c', label: 'Consumption' },
                    { id: 'nx', label: 'Exports minus Imports', explanation: 'NX = X - M.' },
                  ],
                },
              ],
            },
            {
              id: 'diagram',
              component: 'AnnotatedDiagram',
              title: 'Inference Pipeline',
              shapes: [{ kind: 'rect', x: 40, y: 60, width: 120, height: 64 }],
              hotspots: [{ id: 'h1', label: 'Gateway Router', detail: 'Routes SSE streams.', x: 24, y: 65 }],
            },
            {
              id: 'map',
              component: 'RouteMap',
              title: 'Walking Loop',
              stops: [{ id: 'st1', title: 'Ferry Building', lat: 37.7955, lng: -122.3937 }],
            },
            {
              id: 'ledger',
              component: 'SplitLedger',
              title: 'Offsite Expense Ledger',
              guests: ['Maya', 'Theo'],
              items: [{ id: 'd1', name: 'Airport Shuttle', price: 22, sharedBy: [0, 1] }],
              taxAmount: 2,
              tipPercent: 20,
            },
            {
              id: 'arcade',
              component: 'MicroApp',
              title: 'Harmonic Sandbox',
              html: '<div>Canvas Ready</div>',
            },
          ],
        },
      },
    ]);

    await waitFor(() => {
      expect(container.textContent).toContain('$180,000');
      expect(container.textContent).toContain('$236,129');
      expect(container.textContent).toContain('Lamb Roast Steps');
      expect(container.textContent).toContain('Alpine Sage');
      expect(container.textContent).toContain('Inference Pipeline');
      expect(container.textContent).toContain('Ferry Building');
      expect(container.textContent).toContain('Offsite Expense Ledger');
      expect(container.textContent).toContain('Harmonic Sandbox');
    });

    // Adjusting monthly slider updates DataModel and compoundGrowth live!
    const range = container.querySelector('.lumina-slider') as HTMLInputElement;
    fireEvent.change(range, { target: { value: '600' } });
    expect(surface.dataModel.get('/monthly')).toBe(600);
    await waitFor(() => {
      const trackLabel = container.querySelector('.lumina-proportion-track')?.getAttribute('aria-label') ?? '';
      expect(trackLabel).toContain('$216,000');
      expect(trackLabel).toContain('$283,355');
    });
  });
});

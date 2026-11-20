import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';

export interface ExplorerExample {
  id: string;
  category: string;
  title: string;
  description: string;
  componentsUsed: string[];
  messages: Record<string, unknown>[];
}

export const EXPLORER_EXAMPLES: ExplorerExample[] = [
  {
    id: 'agentic-reasoning-hitl',
    category: 'Reasoning & HITL',
    title: 'ThoughtTrace, StepTimeline & ApprovalCard',
    description: 'Collapsible chain-of-thought, multi-step workflow tracker, segmented progress, and @checks-gated high-impact approval.',
    componentsUsed: ['ThoughtTrace', 'StepTimeline', 'ProgressIndicator', 'ApprovalCard', 'CheckBox'],
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'exp-hitl',
          catalogId: LUMINA_V1_CATALOG_ID,
          dataModel: {
            verified: false,
            state: 'pending',
          },
          components: [
            { id: 'root', component: 'Column', gap: 'lg', children: ['thought', 'timeline', 'prog', 'gate'] },
            {
              id: 'thought',
              component: 'ThoughtTrace',
              summary: 'Thought for 3.6s · Audited 3 cluster topologies',
              status: 'complete',
              durationSeconds: 3.6,
              defaultExpanded: true,
              steps: [
                { title: 'Checked canary error budgets', detail: 'Zero 5xx regressions across 120k synthetic requests.' },
                { title: 'Validated rollback path', detail: 'Helm revision 412 pinned for < 15s rollback.' },
              ],
            },
            {
              id: 'timeline',
              component: 'StepTimeline',
              title: 'Release Pipeline',
              steps: [
                { id: '1', title: 'Unit & A2UI Schema Conformance', subtitle: '41 components + 43 Basic v1.0 fixtures passed', status: 'completed', timestamp: '1.2s' },
                { id: '2', title: 'Staging Canary Verification', subtitle: 'p99 38ms across us-east-1', status: 'completed', timestamp: '2.4s' },
                { id: '3', title: 'Production Rollout Gate', subtitle: 'Waiting for engineer sign-off', status: 'active', timestamp: 'Now' },
              ],
            },
            {
              id: 'prog',
              component: 'ProgressIndicator',
              label: 'Canary Rollout Stages',
              sublabel: 'Stage 3 of 4 ready for promotion',
              value: 75,
              variant: 'segmented',
              segments: 4,
              tone: 'accent',
            },
            {
              id: 'gate',
              component: 'ApprovalCard',
              title: 'Promote Release v2.14.2 to 100% Production',
              description: 'Shifts remaining 75% production traffic in us-east-1.',
              riskLevel: 'high',
              state: { '@path': '/state' },
              details: 'verify_cb',
              approveLabel: 'Approve Production Deploy',
              approveAction: { event: { name: 'approve_deploy', context: { version: 'v2.14.2' } } },
              rejectLabel: 'Hold Release',
              rejectAction: { event: { name: 'hold_deploy' } },
              '@checks': [
                { condition: { '@path': '/verified' }, message: 'Check the canary sign-off box to enable deployment.' },
              ],
            },
            {
              id: 'verify_cb',
              component: 'CheckBox',
              label: 'I verified staging telemetry & rollback readiness',
              description: 'Unlocks the high-risk approval gate reactively',
              value: { '@path': '/verified' },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'data-synthesis-charts',
    category: 'Data & Synthesis',
    title: 'KPI Bento Grid, Interactive Charts & Sortable Table',
    description: 'Tabular-numerals StatMetric sparklines, hover/touch-scrub area & donut Charts, and client-sortable DataTable.',
    componentsUsed: ['Grid', 'StatMetric', 'Chart', 'DataTable', 'FollowUpSuggestions'],
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'exp-data',
          catalogId: LUMINA_V1_CATALOG_ID,
          components: [
            { id: 'root', component: 'Column', gap: 'lg', children: ['grid', 'area_chart', 'donut_chart', 'table', 'followups'] },
            { id: 'grid', component: 'Grid', columns: 3, children: ['m1', 'm2', 'm3'] },
            {
              id: 'm1',
              component: 'StatMetric',
              label: 'Annual Recurring Revenue',
              value: '$48.6M',
              delta: '+34.2%',
              trend: 'up',
              sparkline: [26, 30, 34, 39, 44, 48.6],
            },
            {
              id: 'm2',
              component: 'StatMetric',
              label: 'Net Dollar Retention',
              value: '128.4%',
              delta: '+4.1 pts',
              trend: 'up',
              sparkline: [118, 120, 122, 125, 127, 128.4],
            },
            {
              id: 'm3',
              component: 'StatMetric',
              label: 'Median Inference Latency',
              value: '184ms',
              delta: '-29%',
              trend: 'down',
              trendSentiment: 'positive',
              sparkline: [280, 260, 235, 210, 196, 184],
            },
            {
              id: 'area_chart',
              component: 'Chart',
              type: 'area',
              title: 'Quarterly Revenue vs. Inference Spend ($M)',
              subtitle: 'Hover on desktop or touch-scrub on mobile',
              xKey: 'q',
              valuePrefix: '$',
              valueSuffix: 'M',
              series: [
                { key: 'rev', label: 'Revenue', color: 'blue' },
                { key: 'cost', label: 'Compute Cost', color: 'emerald' },
              ],
              data: [
                { q: 'Q1', rev: 28, cost: 6.2 },
                { q: 'Q2', rev: 34, cost: 7.1 },
                { q: 'Q3', rev: 41, cost: 7.9 },
                { q: 'Q4', rev: 48.6, cost: 8.5 },
              ],
            },
            {
              id: 'donut_chart',
              component: 'Chart',
              type: 'donut',
              title: 'Revenue Mix by Customer Tier',
              xKey: 'tier',
              valuePrefix: '$',
              valueSuffix: 'M',
              series: [{ key: 'val', label: 'ARR' }],
              data: [
                { tier: 'Enterprise', val: 28.4 },
                { tier: 'Mid-Market', val: 13.8 },
                { tier: 'Self-Serve Pro', val: 6.4 },
              ],
            },
            {
              id: 'table',
              component: 'DataTable',
              caption: 'Regional Performance (Sortable)',
              columns: [
                { key: 'region', header: 'Region' },
                { key: 'arr', header: 'ARR', format: 'currency', align: 'end' },
                { key: 'yoy', header: 'YoY', format: 'percent', align: 'end' },
                { key: 'status', header: 'Status', format: 'badge', align: 'center' },
              ],
              rows: [
                { id: 'na', region: 'North America', arr: 29400000, yoy: 0.36, status: 'Exceeding' },
                { id: 'eu', region: 'Europe', arr: 11800000, yoy: 0.31, status: 'On Track' },
                { id: 'apac', region: 'Asia-Pacific', arr: 7400000, yoy: 0.48, status: 'Fastest' },
              ],
            },
            {
              id: 'followups',
              component: 'FollowUpSuggestions',
              title: 'Suggested next steps',
              suggestions: [
                { label: 'Break down APAC pipeline', icon: 'trendingUp', action: { event: { name: 'apac_drilldown' } } },
                { label: 'Export board deck memo', icon: 'fileText', action: { event: { name: 'export_memo' } } },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'grounding-code-artifacts',
    category: 'Grounding & Code',
    title: 'SourceList, CodeBlock, DiffViewer & ArtifactCard',
    description: 'ChatGPT Search citation cards, syntax-highlighted copyable code, unified/split patch diff, and Canvas drawer artifact.',
    componentsUsed: ['SourceList', 'Callout', 'CodeBlock', 'DiffViewer', 'ArtifactCard'],
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'exp-grounding',
          catalogId: LUMINA_V1_CATALOG_ID,
          components: [
            { id: 'root', component: 'Column', gap: 'lg', children: ['sources', 'callout', 'code', 'diff', 'artifact'] },
            {
              id: 'sources',
              component: 'SourceList',
              title: 'Grounded Citations',
              variant: 'cards',
              sources: [
                { id: '1', index: 1, title: 'A2UI v1.0 Protocol Specification', url: 'https://a2ui.org/specification/v1.0-a2ui/', snippet: 'Flat component lists, @path bindings, and multi-catalog negotiation.' },
                { id: '2', index: 2, title: 'Apple Human Interface Guidelines — Materials', url: 'https://developer.apple.com/design/human-interface-guidelines/', snippet: 'Optical corner concentricity, translucency, and tactile spring feedback.' },
              ],
            },
            {
              id: 'callout',
              component: 'Callout',
              tone: 'tip',
              title: 'Adaptive Mobile DiffViewer',
              body: 'Switch to the iPhone 15 Pro frame in the top toolbar to watch the split DiffViewer automatically reflow to unified mode.',
            },
            {
              id: 'code',
              component: 'CodeBlock',
              filename: 'src/retry-policy.ts',
              language: 'typescript',
              highlightLines: [4, 5],
              actionLabel: 'Copy & Run',
              action: { event: { name: 'run_snippet' } },
              code: `export async function withJitter<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const delayMs = Math.min(4000, 120 * 2 ** attempt) + Math.random() * 90;
    await new Promise((r) => setTimeout(r, delayMs));
    return withJitter(fn, attempt + 1);
  }
}`,
            },
            {
              id: 'diff',
              component: 'DiffViewer',
              filename: 'config/pool.yaml',
              viewMode: 'split',
              before: `default_pool_size: 25\nquery_wait_timeout: 15\nbackoff: linear`,
              after: `default_pool_size: 80\nquery_wait_timeout: 5\nbackoff: exponential_jitter`,
              acceptAction: { event: { name: 'accept_diff' } },
              rejectAction: { event: { name: 'reject_diff' } },
            },
            {
              id: 'artifact',
              component: 'ArtifactCard',
              title: 'Architecture Review — Resilience RFC',
              subtitle: 'Click Open to test desktop Drawer vs. mobile Bottom Sheet',
              kind: 'document',
              version: 'v3',
              preview: 'Proposal to standardize PgBouncer transaction pooling and jittered retries across checkout services...',
              child: 'art_child',
            },
            {
              id: 'art_child',
              component: 'Column',
              gap: 'md',
              children: ['art_txt', 'art_kv'],
            },
            {
              id: 'art_txt',
              component: 'Text',
              variant: 'body',
              text: 'This Canvas drawer adapts automatically: **side-sheet on desktop** and **draggable iOS bottom sheet on mobile**.',
            },
            {
              id: 'art_kv',
              component: 'KeyValueList',
              items: [
                { label: 'RFC ID', value: 'RFC-2026-08', mono: true, copyable: true },
                { label: 'Status', value: 'Approved', tone: 'success' },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'tactile-inputs-reactive',
    category: 'Tactile Inputs',
    title: 'SegmentedControl, Switch, Stepper, Slider & ChoicePicker',
    description: 'Zero-latency client reactivity with @path bindings, spring controls, and adaptive Modal Bottom Sheet.',
    componentsUsed: ['SegmentedControl', 'StepperInput', 'Switch', 'Slider', 'ChoicePicker', 'TextField', 'DateTimeInput', 'Modal'],
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'exp-inputs',
          catalogId: LUMINA_V1_CATALOG_ID,
          dataModel: {
            plan: 'pro',
            seats: 4,
            sso: true,
            budget: 1200,
            regions: ['us-east', 'eu-west'],
            email: 'alex@company.com',
            launchDate: '2026-05-18',
          },
          components: [
            { id: 'root', component: 'Card', title: 'Workspace Provisioning', subtitle: 'Adjust controls to see instant reactive DataModel updates in the Inspector', children: ['seg', 'step', 'sw', 'sl', 'cp', 'tf', 'dt', 'modal_row'] },
            {
              id: 'seg',
              component: 'SegmentedControl',
              label: 'Tier',
              value: { '@path': '/plan' },
              options: [
                { label: 'Starter', value: 'starter' },
                { label: 'Pro', value: 'pro' },
                { label: 'Enterprise', value: 'enterprise' },
              ],
            },
            { id: 'step', component: 'StepperInput', label: 'Team Seats', description: 'Licensed builders', value: { '@path': '/seats' }, min: 1, max: 50 },
            { id: 'sw', component: 'Switch', label: 'Enforce SAML SSO', description: 'Require Okta / Google Workspace sign-in', value: { '@path': '/sso' } },
            { id: 'sl', component: 'Slider', label: 'Monthly Compute Cap', min: 200, max: 5000, steps: 24, value: { '@path': '/budget' }, unit: 'USD' },
            {
              id: 'cp',
              component: 'ChoicePicker',
              label: 'Deployment Regions',
              variant: 'multipleSelection',
              displayStyle: 'chips',
              value: { '@path': '/regions' },
              options: [
                { label: 'US East', value: 'us-east' },
                { label: 'EU West', value: 'eu-west' },
                { label: 'Tokyo', value: 'ap-northeast' },
              ],
            },
            { id: 'tf', component: 'TextField', label: 'Admin Email', variant: 'email', value: { '@path': '/email' }, clearable: true },
            { id: 'dt', component: 'DateTimeInput', label: 'Target Launch Date', value: { '@path': '/launchDate' }, enableDate: true },
            {
              id: 'modal_row',
              component: 'Row',
              justify: 'spaceBetween',
              children: ['modal_demo', 'submit_btn'],
            },
            {
              id: 'modal_demo',
              component: 'Modal',
              title: 'Security & Compliance Summary',
              description: 'Adaptive frosted dialog (desktop) / draggable sheet (mobile)',
              trigger: 'modal_btn',
              content: 'modal_kv',
            },
            { id: 'modal_btn', component: 'Button', label: 'Preview Modal / Sheet', variant: 'secondary', action: { event: { name: 'opened_modal' } } },
            {
              id: 'modal_kv',
              component: 'KeyValueList',
              items: [
                { label: 'Encryption', value: 'AES-256-GCM' },
                { label: 'Compliance', value: 'SOC 2 Type II + ISO 27001', tone: 'success' },
                { label: 'Audit Retention', value: '365 days' },
              ],
            },
            { id: 'submit_btn', component: 'Button', label: 'Provision Workspace', variant: 'primary', icon: 'sparkles', action: { event: { name: 'provision_workspace', context: { seats: { '@path': '/seats' }, plan: { '@path': '/plan' } } } } },
          ],
        },
      },
    ],
  },
  {
    id: 'layout-comparison-carousel',
    category: 'Layout & Media',
    title: 'Tabs, Carousel, ComparisonMatrix, Accordion & Identity',
    description: 'Apple HIG navigation primitives: sliding-pill Tabs, swipeable Carousel, ComparisonMatrix, Accordion, Avatar, and StatusBadge.',
    componentsUsed: ['Tabs', 'Carousel', 'ComparisonMatrix', 'Accordion', 'Avatar', 'StatusBadge', 'KeyValueList', 'Divider'],
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'exp-layout',
          catalogId: LUMINA_V1_CATALOG_ID,
          components: [
            { id: 'root', component: 'Column', gap: 'lg', children: ['top_row', 'tabs_main', 'acc'] },
            {
              id: 'top_row',
              component: 'Row',
              justify: 'spaceBetween',
              children: ['agent_avatar', 'live_badge'],
            },
            { id: 'agent_avatar', component: 'Avatar', name: 'Lumina Travel Agent', subtitle: 'A2UI v1.0 · Active Session', status: 'online' },
            { id: 'live_badge', component: 'StatusBadge', label: 'Connected', tone: 'success', pulse: true },
            {
              id: 'tabs_main',
              component: 'Tabs',
              variant: 'segmented',
              tabs: [
                { title: 'Compare Options', child: 'matrix', icon: 'layers', badge: '3' },
                { title: 'Visual Rail', child: 'rail', icon: 'compass' },
              ],
            },
            {
              id: 'matrix',
              component: 'ComparisonMatrix',
              criteria: [
                { key: 'speed', label: 'Throughput' },
                { key: 'ctx', label: 'Context' },
                { key: 'price', label: 'Cost / 1M' },
              ],
              options: [
                { id: 'flash', title: 'Gemini 2.5 Flash', subtitle: 'Low Latency', badge: 'Best Value', recommended: true, values: { speed: '210 tok/s', ctx: '1M', price: '$0.30' }, actionLabel: 'Use Flash', action: { event: { name: 'pick_model', context: { model: 'flash' } } } },
                { id: 'pro', title: 'Gemini 2.5 Pro', subtitle: 'Deep Reasoning', values: { speed: '95 tok/s', ctx: '2M', price: '$1.25' }, actionLabel: 'Use Pro', action: { event: { name: 'pick_model', context: { model: 'pro' } } } },
              ],
            },
            {
              id: 'rail',
              component: 'Carousel',
              itemWidth: 'compact',
              children: ['c1', 'c2', 'c3'],
            },
            { id: 'c1', component: 'Card', title: 'Otemachi', subtitle: 'Financial core', child: 'c1t' },
            { id: 'c1t', component: 'Text', variant: 'caption', text: 'Direct Shinkansen & Haneda access.' },
            { id: 'c2', component: 'Card', title: 'Azabudai', subtitle: 'Modern wellness', child: 'c2t' },
            { id: 'c2t', component: 'Text', variant: 'caption', text: 'New architectural landmark district.' },
            { id: 'c3', component: 'Card', title: 'Aoyama', subtitle: 'Design & dining', child: 'c3t' },
            { id: 'c3t', component: 'Text', variant: 'caption', text: 'Boutique studios and Michelin spots.' },
            {
              id: 'acc',
              component: 'Accordion',
              items: [
                { id: 'a1', title: 'Cancellation Policy', subtitle: 'Flexible up to 48 hours prior', child: 'a1_txt', defaultOpen: true },
                { id: 'a2', title: 'Multi-Platform Portability', subtitle: 'React, Angular, Flutter, SwiftUI, Compose', child: 'a2_txt' },
              ],
            },
            { id: 'a1_txt', component: 'Text', variant: 'body', text: 'Full refund with zero change fee up to 48 hours before scheduled departure.' },
            { id: 'a2_txt', component: 'Text', variant: 'body', text: 'Every Lumina surface speaks pure A2UI v1.0 JSON Schema so native iOS, Android, Flutter, and Angular renderers render the identical contract.' },
          ],
        },
      },
    ],
  },
  {
    id: 'media-typography-basic',
    category: 'Typography & Media',
    title: 'Text Markdown, Image Lightbox, Icon, AudioPlayer & KeyValueList',
    description: 'Upgraded A2UI v1.0 Basic Catalog display primitives with optical typography, tap-to-zoom Image, Lucide Icons, Voice AudioPlayer, and Apple Wallet KeyValueList.',
    componentsUsed: ['Text', 'Image', 'Icon', 'AudioPlayer', 'KeyValueList', 'Row', 'Divider'],
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'exp-media',
          catalogId: LUMINA_V1_CATALOG_ID,
          components: [
            { id: 'root', component: 'Column', gap: 'lg', children: ['hero_card', 'icon_row', 'audio_brief', 'wallet_kv'] },
            {
              id: 'hero_card',
              component: 'Card',
              variant: 'elevated',
              title: 'Optical Typography & Zoomable Media',
              subtitle: 'Markdown-ready Text + tap-to-zoom Image lightbox',
              children: ['md_text', 'div1', 'cover_img'],
            },
            {
              id: 'md_text',
              component: 'Text',
              variant: 'body',
              text: 'Lumina renders sanitized **Markdown prose**, inline `A2UI v1.0` code tokens, and optical heading scales (`hero` through `overline`) with zero layout shift.',
            },
            { id: 'div1', component: 'Divider', label: 'Visual Media' },
            {
              id: 'cover_img',
              component: 'Image',
              url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 340'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%230071E3'/><stop offset='55%25' stop-color='%235E5CE6'/><stop offset='100%25' stop-color='%2310A37F'/></linearGradient></defs><rect width='800' height='340' fill='url(%23g)'/><circle cx='660' cy='90' r='110' fill='rgba(255,255,255,0.14)'/><circle cx='140' cy='280' r='150' fill='rgba(255,255,255,0.10)'/><text x='48' y='158' fill='white' font-family='system-ui,sans-serif' font-size='38' font-weight='700'>Tokyo Haneda · Executive Suite</text><text x='48' y='204' fill='rgba(255,255,255,0.86)' font-family='system-ui,sans-serif' font-size='20'>Click image to inspect Apple Photos-style zoom lightbox</text></svg>",
              description: 'Tokyo Haneda Executive Suite Preview',
              variant: 'rounded',
              aspectRatio: '21:9',
              zoomable: true,
            },
            {
              id: 'icon_row',
              component: 'Card',
              title: 'Vector Icon Registry (83 Icons)',
              subtitle: 'All 58 Basic Catalog v1.0 icons + 25 agentic icons mapped to Lucide',
              child: 'icons_flex',
            },
            {
              id: 'icons_flex',
              component: 'Row',
              gap: 'lg',
              wrap: true,
              children: ['ic1', 'ic2', 'ic3', 'ic4', 'ic5', 'ic6', 'ic7'],
            },
            { id: 'ic1', component: 'Icon', name: 'sparkles', size: 'lg', tone: 'accent' },
            { id: 'ic2', component: 'Icon', name: 'brain', size: 'lg', tone: 'primary' },
            { id: 'ic3', component: 'Icon', name: 'flight', size: 'lg', tone: 'accent' },
            { id: 'ic4', component: 'Icon', name: 'shieldCheck', size: 'lg', tone: 'success' },
            { id: 'ic5', component: 'Icon', name: 'trendingUp', size: 'lg', tone: 'success' },
            { id: 'ic6', component: 'Icon', name: 'terminal', size: 'lg', tone: 'secondary' },
            { id: 'ic7', component: 'Icon', name: 'alertTriangle', size: 'lg', tone: 'warning' },
            {
              id: 'audio_brief',
              component: 'AudioPlayer',
              url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=',
              description: 'Executive Morning Voice Brief',
              subtitle: 'Lumina Voice · 1x / 1.5x / 2x speed control',
            },
            {
              id: 'wallet_kv',
              component: 'KeyValueList',
              title: 'Apple Wallet Receipt & Copyable Identifiers',
              items: [
                { label: 'Catalog Protocol', value: 'A2UI v1.0', tone: 'accent' },
                { label: 'Confirmation Code', value: 'LUM-8842K', mono: true, copyable: true },
                { label: 'Components / Functions', value: '41 Components · 20 Functions', tone: 'strong' },
              ],
            },
          ],
        },
      },
    ],
  },
];

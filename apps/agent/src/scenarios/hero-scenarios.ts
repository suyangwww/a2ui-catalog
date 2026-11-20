import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';

export interface HeroScenarioSummary {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  prompt: string;
  icon: string;
}

export const HERO_SCENARIO_LIST: HeroScenarioSummary[] = [
  {
    id: 'tokyo-travel',
    title: 'Executive Tokyo Concierge',
    subtitle: 'Flight matrix, boutique hotels, interactive fare builder & Apple Wallet pass',
    badge: 'Multi-Turn HITL',
    prompt: 'Plan a 4-day executive trip to Tokyo in May with nonstop business flights and boutique hotels.',
    icon: 'flight',
  },
  {
    id: 'deep-research',
    title: 'AI Semiconductor Deep Research',
    subtitle: 'Grounded citations, KPI sparklines, interactive area charts, sortable table & Canvas memo',
    badge: 'Deep Research',
    prompt: 'Synthesize Q3 AI semiconductor market growth, hyperscaler capex, and gross margins with sources.',
    icon: 'chartBar',
  },
  {
    id: 'devops-copilot',
    title: 'Production Incident & Hotfix Copilot',
    subtitle: 'Live triage timeline, p99 latency chart, SQL diagnostics, split diff & check-gated rollout',
    badge: 'DevOps Safety',
    prompt: 'Investigate the checkout-api p99 latency spike in us-east-1 and prepare a safe hotfix.',
    icon: 'terminal',
  },
  {
    id: 'wealth-optimizer',
    title: 'Wealth & Subscription Optimizer',
    subtitle: 'Spending donut chart, templated subscription toggles, live slider simulator & rebalance gate',
    badge: 'Reactive Math',
    prompt: 'Audit my recurring monthly subscriptions and simulate reallocating savings into index ETFs.',
    icon: 'wallet',
  },
];

export interface ReplayTurn {
  textPrefix: string;
  chunks: Array<{ delayMs: number; messages: Record<string, unknown>[] }>;
  finalState: 'input-required' | 'completed';
}

function makeTokyoTurn1(surfaceId: string): ReplayTurn {
  return {
    textPrefix: 'Here is a curated 4-day executive itinerary for Tokyo in May, comparing top nonstop carriers and boutique stays.',
    finalState: 'input-required',
    chunks: [
      {
        delayMs: 60,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              sendDataModel: true,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['thought', 'timeline'],
                },
                {
                  id: 'thought',
                  component: 'ThoughtTrace',
                  summary: 'Checking nonstop SFO -> HND fares & May availability...',
                  status: 'thinking',
                  steps: [
                    { title: 'Queried live schedules', detail: 'Filtered nonstop lie-flat business cabins into Haneda (HND).' },
                    { title: 'Ranked executive hotels', detail: 'Matched Aman Tokyo, Hoshinoya Tokyo, and Janu Tokyo in Minato/Otemachi.' },
                  ],
                },
                {
                  id: 'timeline',
                  component: 'StepTimeline',
                  title: 'Concierge Search Progress',
                  steps: [
                    { id: 's1', title: 'Flight Inventory (SFO -> HND)', subtitle: '3 nonstop carriers verified', status: 'completed', timestamp: '0.6s' },
                    { id: 's2', title: 'Boutique Hotel Curation', subtitle: 'Checking corporate rates...', status: 'active', timestamp: '1.1s' },
                    { id: 's3', title: 'Weather & Transfer Forecast', subtitle: 'Haneda private transfer timing', status: 'pending' },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        delayMs: 260,
        messages: [
          {
            version: '1.0',
            updateComponents: {
              surfaceId,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['thought', 'timeline', 'flight_matrix', 'hotel_carousel', 'followups'],
                },
                {
                  id: 'thought',
                  component: 'ThoughtTrace',
                  summary: 'Thought for 2.4s · Ranked 3 nonstop flights & 3 luxury hotels',
                  status: 'complete',
                  durationSeconds: 2.4,
                  steps: [
                    { title: 'Queried live schedules', detail: 'Filtered nonstop lie-flat business cabins into Haneda (HND) with >94% on-time score.' },
                    { title: 'Ranked executive hotels', detail: 'Matched Aman Tokyo, Hoshinoya Tokyo, and Janu Tokyo with flexible cancellation.' },
                    { title: 'Checked May weather', detail: '21°C average high, light spring breeze — ideal for Marunouchi meetings.' },
                  ],
                },
                {
                  id: 'timeline',
                  component: 'StepTimeline',
                  title: 'Concierge Preparation Complete',
                  steps: [
                    { id: 's1', title: 'Flight Inventory (SFO -> HND)', subtitle: 'ANA NH 105 leads on seat privacy & on-time arrival', status: 'completed', timestamp: '0.6s' },
                    { id: 's2', title: 'Boutique Hotel Curation', subtitle: 'Corporate flexible rates locked for May 12–16', status: 'completed', timestamp: '1.4s' },
                    { id: 's3', title: 'Private Haneda Transfer', subtitle: '35 min door-to-door to Otemachi Tower', status: 'completed', timestamp: '2.1s' },
                  ],
                },
                {
                  id: 'flight_matrix',
                  component: 'ComparisonMatrix',
                  title: 'Nonstop Business Class — SFO to Tokyo Haneda (May 12–16)',
                  criteria: [
                    { key: 'schedule', label: 'Schedule' },
                    { key: 'duration', label: 'Duration' },
                    { key: 'cabin', label: 'Suite Product' },
                    { key: 'ontime', label: 'On-Time Score' },
                  ],
                  options: [
                    {
                      id: 'nh105',
                      title: 'ANA NH 105',
                      subtitle: '$4,280 roundtrip',
                      badge: 'Recommended',
                      recommended: true,
                      values: {
                        schedule: '12:15 PM -> 3:25 PM+1',
                        duration: '11h 10m',
                        cabin: 'THE Room (Sliding Door)',
                        ontime: '96.4%',
                      },
                      actionLabel: 'Select ANA NH 105',
                      action: {
                        event: {
                          name: 'select_flight',
                          userMessage: 'Select ANA NH 105 & customize trip',
                          context: { flight: 'ANA NH 105', fare: 4280, hotel: 'Aman Tokyo' },
                        },
                      },
                    },
                    {
                      id: 'jl005',
                      title: 'JAL JL 005',
                      subtitle: '$4,520 roundtrip',
                      values: {
                        schedule: '1:40 PM -> 4:55 PM+1',
                        duration: '11h 15m',
                        cabin: 'APEX Suite III',
                        ontime: '94.8%',
                      },
                      actionLabel: 'Select JAL JL 005',
                      action: {
                        event: {
                          name: 'select_flight',
                          userMessage: 'Select JAL JL 005 & customize trip',
                          context: { flight: 'JAL JL 005', fare: 4520, hotel: 'Hoshinoya Tokyo' },
                        },
                      },
                    },
                    {
                      id: 'ua837',
                      title: 'United UA 837',
                      subtitle: '$3,940 roundtrip',
                      badge: 'Lowest Fare',
                      values: {
                        schedule: '11:05 AM -> 2:30 PM+1',
                        duration: '11h 25m',
                        cabin: 'Polaris Business',
                        ontime: '91.2%',
                      },
                      actionLabel: 'Select UA 837',
                      action: {
                        event: {
                          name: 'select_flight',
                          userMessage: 'Select United UA 837 & customize trip',
                          context: { flight: 'United UA 837', fare: 3940, hotel: 'Janu Tokyo' },
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'hotel_carousel',
                  component: 'Carousel',
                  title: 'Curated Tokyo Stays (4 Nights)',
                  itemWidth: 'standard',
                  children: ['hotel_aman', 'hotel_hoshino', 'hotel_janu'],
                },
                {
                  id: 'hotel_aman',
                  component: 'Card',
                  title: 'Aman Tokyo',
                  subtitle: 'Otemachi Tower · 33rd Floor',
                  headerTrailing: 'hotel_aman_badge',
                  child: 'hotel_aman_body',
                  footer: 'hotel_aman_btn',
                },
                { id: 'hotel_aman_badge', component: 'StatusBadge', label: 'Top Pick', tone: 'success', size: 'sm' },
                {
                  id: 'hotel_aman_body',
                  component: 'KeyValueList',
                  dividers: true,
                  items: [
                    { label: 'Rate', value: '$1,180 / night', tone: 'strong' },
                    { label: 'District', value: '5 min to Tokyo Station' },
                    { label: 'Perks', value: 'Breakfast + Onsen Spa' },
                  ],
                },
                {
                  id: 'hotel_aman_btn',
                  component: 'Button',
                  label: 'Pair with ANA NH 105',
                  variant: 'primary',
                  fullWidth: true,
                  action: {
                    event: {
                      name: 'select_flight',
                      userMessage: 'Customize ANA NH 105 + Aman Tokyo',
                      context: { flight: 'ANA NH 105', fare: 4280, hotel: 'Aman Tokyo' },
                    },
                  },
                },
                {
                  id: 'hotel_hoshino',
                  component: 'Card',
                  title: 'Hoshinoya Tokyo',
                  subtitle: 'Luxury Modern Ryokan · Otemachi',
                  headerTrailing: 'hotel_hoshino_badge',
                  child: 'hotel_hoshino_body',
                  footer: 'hotel_hoshino_btn',
                },
                { id: 'hotel_hoshino_badge', component: 'StatusBadge', label: 'Hot Spring', tone: 'accent', size: 'sm' },
                {
                  id: 'hotel_hoshino_body',
                  component: 'KeyValueList',
                  items: [
                    { label: 'Rate', value: '$890 / night', tone: 'strong' },
                    { label: 'District', value: 'Financial Core' },
                    { label: 'Perks', value: 'Rooftop Natural Onsen' },
                  ],
                },
                {
                  id: 'hotel_hoshino_btn',
                  component: 'Button',
                  label: 'Choose Hoshinoya',
                  variant: 'secondary',
                  fullWidth: true,
                  action: {
                    event: {
                      name: 'select_flight',
                      userMessage: 'Customize ANA NH 105 + Hoshinoya Tokyo',
                      context: { flight: 'ANA NH 105', fare: 4280, hotel: 'Hoshinoya Tokyo' },
                    },
                  },
                },
                {
                  id: 'hotel_janu',
                  component: 'Card',
                  title: 'Janu Tokyo',
                  subtitle: 'Azabudai Hills · Aman Sister Brand',
                  headerTrailing: 'hotel_janu_badge',
                  child: 'hotel_janu_body',
                  footer: 'hotel_janu_btn',
                },
                { id: 'hotel_janu_badge', component: 'StatusBadge', label: 'New 2026', tone: 'info', size: 'sm' },
                {
                  id: 'hotel_janu_body',
                  component: 'KeyValueList',
                  items: [
                    { label: 'Rate', value: '$940 / night', tone: 'strong' },
                    { label: 'District', value: 'Minato / Azabudai' },
                    { label: 'Perks', value: '4,000 m² Wellness Club' },
                  ],
                },
                {
                  id: 'hotel_janu_btn',
                  component: 'Button',
                  label: 'Choose Janu Tokyo',
                  variant: 'secondary',
                  fullWidth: true,
                  action: {
                    event: {
                      name: 'select_flight',
                      userMessage: 'Customize ANA NH 105 + Janu Tokyo',
                      context: { flight: 'ANA NH 105', fare: 4280, hotel: 'Janu Tokyo' },
                    },
                  },
                },
                {
                  id: 'followups',
                  component: 'FollowUpSuggestions',
                  title: 'Next steps',
                  suggestions: [
                    {
                      label: 'Customize ANA NH 105 + Aman Tokyo',
                      icon: 'flight',
                      action: {
                        event: {
                          name: 'select_flight',
                          userMessage: 'Customize ANA NH 105 + Aman Tokyo',
                          context: { flight: 'ANA NH 105', fare: 4280, hotel: 'Aman Tokyo' },
                        },
                      },
                    },
                    {
                      label: 'Compare Shibuya dining spots',
                      icon: 'compass',
                      action: {
                        event: { name: 'select_flight', userMessage: 'Customize ANA NH 105 + Hoshinoya Tokyo', context: { flight: 'ANA NH 105', fare: 4280, hotel: 'Hoshinoya Tokyo' } },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeTokyoTurn2(surfaceId: string, context: Record<string, unknown>): ReplayTurn {
  const flight = String(context.flight ?? 'ANA NH 105');
  const hotel = String(context.hotel ?? 'Aman Tokyo');
  const baseFare = Number(context.fare ?? 4280);
  return {
    textPrefix: `Configure your ${flight} & ${hotel} package below, then hold and confirm your itinerary.`,
    finalState: 'input-required',
    chunks: [
      {
        delayMs: 70,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              sendDataModel: true,
              dataModel: {
                flight,
                hotel,
                cabin: 'business',
                travelers: 1,
                nights: 4,
                transfer: true,
                total: baseFare + 4720,
                notes: 'Quiet corner suite, window seat 5A',
              },
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['summary_grid', 'config_card', 'approval'],
                },
                {
                  id: 'summary_grid',
                  component: 'Grid',
                  columns: 2,
                  children: ['stat_total', 'stat_hold'],
                },
                {
                  id: 'stat_total',
                  component: 'StatMetric',
                  label: 'Estimated Package Total',
                  value: { '@call': 'formatCurrency', args: { value: { '@path': '/total' }, currency: 'USD' } },
                  delta: 'Corporate Flex',
                  trendSentiment: 'positive',
                  caption: `${flight} + ${hotel}`,
                },
                {
                  id: 'stat_hold',
                  component: 'StatMetric',
                  label: 'Free Cancellation Window',
                  value: '48 hours',
                  delta: 'Zero Hold Fee',
                  trendSentiment: 'neutral',
                  caption: 'Instant ticket issuance on approval',
                },
                {
                  id: 'config_card',
                  component: 'Card',
                  title: 'Customize Itinerary Preferences',
                  subtitle: 'Changes sync immediately to your corporate travel profile',
                  children: ['cabin_seg', 'traveler_step', 'nights_step', 'transfer_sw', 'notes_field'],
                },
                {
                  id: 'cabin_seg',
                  component: 'SegmentedControl',
                  label: 'Cabin Class',
                  value: { '@path': '/cabin' },
                  options: [
                    { label: 'Premium Economy', value: 'premium' },
                    { label: 'Business (THE Room)', value: 'business' },
                    { label: 'First Suite', value: 'first' },
                  ],
                },
                {
                  id: 'traveler_step',
                  component: 'StepperInput',
                  label: 'Travelers',
                  description: 'Executive seat block',
                  value: { '@path': '/travelers' },
                  min: 1,
                  max: 4,
                },
                {
                  id: 'nights_step',
                  component: 'StepperInput',
                  label: 'Hotel Nights',
                  description: `${hotel} (May 12 check-in)`,
                  value: { '@path': '/nights' },
                  min: 2,
                  max: 10,
                },
                {
                  id: 'transfer_sw',
                  component: 'Switch',
                  label: 'Private Haneda Chauffeur Transfer',
                  description: 'Lexus LM meet-and-greet at International Arrivals',
                  value: { '@path': '/transfer' },
                },
                {
                  id: 'notes_field',
                  component: 'TextField',
                  label: 'Concierge Notes',
                  value: { '@path': '/notes' },
                  placeholder: 'Dietary, seat, or meeting preferences',
                  clearable: true,
                },
                {
                  id: 'approval',
                  component: 'ApprovalCard',
                  title: 'Hold & Confirm Tokyo Itinerary',
                  description: 'Charges corporate Amex ending in 4018 with 48h free cancellation.',
                  riskLevel: 'medium',
                  details: 'approval_kv',
                  approveLabel: 'Confirm & Issue Pass',
                  approveAction: {
                    event: {
                      name: 'confirm_booking',
                      userMessage: 'Confirm & issue Tokyo itinerary pass',
                      context: {
                        flight: { '@path': '/flight' },
                        hotel: { '@path': '/hotel' },
                        cabin: { '@path': '/cabin' },
                        travelers: { '@path': '/travelers' },
                        nights: { '@path': '/nights' },
                        transfer: { '@path': '/transfer' },
                      },
                    },
                  },
                  rejectLabel: 'Back to Flights',
                  rejectAction: {
                    event: { name: 'restart_travel', userMessage: 'Show flight options again' },
                  },
                },
                {
                  id: 'approval_kv',
                  component: 'KeyValueList',
                  items: [
                    { label: 'Carrier', value: { '@path': '/flight' }, tone: 'strong' },
                    { label: 'Hotel', value: { '@path': '/hotel' } },
                    { label: 'Payment', value: 'Corporate Amex ···· 4018', mono: true },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeTokyoTurn3(surfaceId: string, context: Record<string, unknown>): ReplayTurn {
  const flight = String(context.flight ?? 'ANA NH 105');
  const hotel = String(context.hotel ?? 'Aman Tokyo');
  const travelers = Number(context.travelers ?? 1);
  const nights = Number(context.nights ?? 4);
  return {
    textPrefix: 'Your Tokyo itinerary is confirmed and ticketed. You can open the full day-by-day Canvas briefing below.',
    finalState: 'completed',
    chunks: [
      {
        delayMs: 80,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['pass_card', 'artifact_itinerary'],
                },
                {
                  id: 'pass_card',
                  component: 'Card',
                  variant: 'elevated',
                  title: `${flight} · SFO -> HND`,
                  subtitle: 'May 12, 12:15 PM · Terminal I, Gate G4',
                  headerTrailing: 'pass_badge',
                  child: 'pass_kv',
                },
                {
                  id: 'pass_badge',
                  component: 'StatusBadge',
                  label: 'Confirmed · On Time',
                  tone: 'success',
                  pulse: true,
                },
                {
                  id: 'pass_kv',
                  component: 'KeyValueList',
                  items: [
                    { label: 'Confirmation PNR', value: 'LUM-8842K', copyable: true, mono: true, tone: 'accent' },
                    { label: 'Hotel', value: `${hotel} (${nights} nights)` },
                    { label: 'Travelers', value: `${travelers} Executive Passenger${travelers > 1 ? 's' : ''}` },
                    { label: 'Seat Assignment', value: '5A · THE Room Window', mono: true },
                    { label: 'Haneda Transfer', value: 'Chauffeur Assigned (Lexus LM)' },
                  ],
                },
                {
                  id: 'artifact_itinerary',
                  component: 'ArtifactCard',
                  title: 'Tokyo Executive Briefing & Day-by-Day Itinerary',
                  subtitle: 'Updated just now · 4-day schedule + dining holds',
                  kind: 'itinerary',
                  version: 'v1',
                  preview: 'Day 1: Haneda arrival & Aman check-in · Day 2: Marunouchi partner summits · Day 3: Shibuya studio tour & Sushi Saito hold...',
                  child: 'artifact_body',
                },
                {
                  id: 'artifact_body',
                  component: 'Column',
                  gap: 'md',
                  children: ['art_callout', 'art_steps'],
                },
                {
                  id: 'art_callout',
                  component: 'Callout',
                  tone: 'success',
                  title: 'Calendar Invites Synced',
                  body: 'All flight legs, hotel check-in details, and transfer confirmations have been formatted for your calendar.',
                },
                {
                  id: 'art_steps',
                  component: 'StepTimeline',
                  title: '4-Day Schedule',
                  steps: [
                    { id: 'd1', title: 'Day 1 (May 12–13) · Arrival & Otemachi', subtitle: 'Land HND 3:25 PM · Private transfer · Aman Spa decompression', status: 'completed', timestamp: 'May 13' },
                    { id: 'd2', title: 'Day 2 (May 14) · Executive Summits', subtitle: 'Marunouchi Trust Tower briefings · Dinner at Florilège Azabudai', status: 'active', timestamp: 'May 14' },
                    { id: 'd3', title: 'Day 3 (May 15) · Ecosystem Visits', subtitle: 'Roppongi & Shibuya product demos · Evening reception', status: 'pending', timestamp: 'May 15' },
                    { id: 'd4', title: 'Day 4 (May 16) · Departure HND -> SFO', subtitle: 'ANA Suite Lounge · Evening flight back to San Francisco', status: 'pending', timestamp: 'May 16' },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeDeepResearchTurn1(surfaceId: string): ReplayTurn {
  return {
    textPrefix: 'Here is the synthesized Q3 AI semiconductor market report backed by 4 grounded filings and interactive margin/revenue telemetry.',
    finalState: 'input-required',
    chunks: [
      {
        delayMs: 60,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['thought', 'progress'],
                },
                {
                  id: 'thought',
                  component: 'ThoughtTrace',
                  summary: 'Synthesizing Q3 earnings transcripts & CoWoS wafer supply...',
                  status: 'thinking',
                  steps: [
                    { title: 'Parsed 4 institutional filings', detail: 'Extracted quarterly data center revenue, HBM3E attach rates, and gross margins.' },
                  ],
                },
                {
                  id: 'progress',
                  component: 'ProgressIndicator',
                  label: 'Indexing semiconductor filings',
                  sublabel: '14 of 18 tables normalized',
                  value: 76,
                  variant: 'bar',
                },
              ],
            },
          },
        ],
      },
      {
        delayMs: 280,
        messages: [
          {
            version: '1.0',
            updateComponents: {
              surfaceId,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['thought', 'sources', 'kpi_grid', 'rev_chart', 'seg_table', 'insight', 'memo_artifact', 'followups'],
                },
                {
                  id: 'thought',
                  component: 'ThoughtTrace',
                  summary: 'Thought for 4.8s · Verified 4 filings & 18 financial tables',
                  status: 'complete',
                  durationSeconds: 4.8,
                  steps: [
                    { title: 'Collected hyperscaler capex disclosures', detail: 'Combined Microsoft, Google, Meta, and Amazon Q3 infrastructure run-rates.' },
                    { title: 'Cross-checked foundry packaging supply', detail: 'Verified TSMC CoWoS-L ramp and HBM3E yield curves.' },
                    { title: 'Normalized segment gross margins', detail: 'Adjusted non-GAAP figures to comparable fiscal quarters.' },
                  ],
                },
                {
                  id: 'sources',
                  component: 'SourceList',
                  title: 'Grounded Sources (4)',
                  variant: 'cards',
                  sources: [
                    {
                      id: 'src1',
                      index: 1,
                      title: 'Q3 Data Center Accelerator Revenue & Margin Filing',
                      url: 'https://investor.example.com/filings/q3-accelerators',
                      domain: 'investor.example.com',
                      snippet: 'Data center compute grew 68% YoY on Blackwell rack-scale ramps.',
                      publishedAt: '2 days ago',
                    },
                    {
                      id: 'src2',
                      index: 2,
                      title: 'TSMC CoWoS-L & 2nm Packaging Capacity Outlook',
                      url: 'https://semi-research.example.org/cowos-2026',
                      domain: 'semi-research.example.org',
                      snippet: 'Advanced packaging wafer starts projected to double through FY26.',
                      publishedAt: '5 days ago',
                    },
                    {
                      id: 'src3',
                      index: 3,
                      title: 'Hyperscaler Cloud Capex Tracker — Q3 2026',
                      url: 'https://markets.example.net/cloud-capex',
                      domain: 'markets.example.net',
                      snippet: 'Top 4 cloud providers guided $268B annualized AI infrastructure spend.',
                      publishedAt: '1 week ago',
                    },
                    {
                      id: 'src4',
                      index: 4,
                      title: 'HBM3E & Optical Interconnect Supply Balance',
                      url: 'https://memory-index.example.io/hbm3e-q3',
                      domain: 'memory-index.example.io',
                      snippet: 'High-bandwidth memory pricing remains firm at +14% QoQ ASP.',
                      publishedAt: '1 week ago',
                    },
                  ],
                },
                {
                  id: 'kpi_grid',
                  component: 'Grid',
                  columns: 3,
                  children: ['kpi_tam', 'kpi_gm', 'kpi_capex'],
                },
                {
                  id: 'kpi_tam',
                  component: 'StatMetric',
                  label: 'AI Accelerator Run-Rate',
                  value: '$164.2B',
                  delta: '+68.4% YoY',
                  trend: 'up',
                  sparkline: [68, 84, 102, 129, 148, 164],
                  caption: 'Annualized Q3 silicon revenue',
                },
                {
                  id: 'kpi_gm',
                  component: 'StatMetric',
                  label: 'Blended Gross Margin',
                  value: '74.6%',
                  delta: '+210 bps',
                  trend: 'up',
                  sparkline: [69.2, 70.8, 72.1, 73.4, 74.0, 74.6],
                  caption: 'Rack-scale systems & networking',
                },
                {
                  id: 'kpi_capex',
                  component: 'StatMetric',
                  label: 'Top-4 Cloud Capex',
                  value: '$67.1B',
                  delta: '+44.2% YoY',
                  trend: 'up',
                  sparkline: [39, 44, 51, 56, 62, 67],
                  caption: 'Single-quarter infrastructure spend',
                },
                {
                  id: 'rev_chart',
                  component: 'Chart',
                  type: 'area',
                  title: 'Quarterly AI Silicon Revenue by Layer ($B)',
                  subtitle: 'Hover or scrub across quarters to inspect Compute vs. Networking & HBM',
                  xKey: 'quarter',
                  valuePrefix: '$',
                  valueSuffix: 'B',
                  height: 245,
                  series: [
                    { key: 'compute', label: 'AI Compute', color: 'blue' },
                    { key: 'networking', label: 'Networking & HBM', color: 'emerald' },
                  ],
                  data: [
                    { quarter: 'Q2 25', compute: 24.5, networking: 8.2 },
                    { quarter: 'Q3 25', compute: 29.1, networking: 10.1 },
                    { quarter: 'Q4 25', compute: 33.8, networking: 11.9 },
                    { quarter: 'Q1 26', compute: 37.4, networking: 13.4 },
                    { quarter: 'Q2 26', compute: 41.2, networking: 15.1 },
                    { quarter: 'Q3 26', compute: 45.8, networking: 17.3 },
                  ],
                },
                {
                  id: 'seg_table',
                  component: 'DataTable',
                  caption: 'Segment Breakdown (Click headers to sort)',
                  columns: [
                    { key: 'segment', header: 'Segment' },
                    { key: 'revenue', header: 'Q3 Revenue ($M)', format: 'currency', align: 'end' },
                    { key: 'growth', header: 'YoY Growth', format: 'percent', align: 'end' },
                    { key: 'margin', header: 'Gross Margin', format: 'percent', align: 'end' },
                    { key: 'supply', header: 'Supply Status', format: 'badge', align: 'center' },
                  ],
                  rows: [
                    { id: '1', segment: 'Training Accelerators', revenue: 31400, growth: 0.72, margin: 0.764, supply: 'Tight' },
                    { id: '2', segment: 'Inference Silicon', revenue: 14400, growth: 0.91, margin: 0.728, supply: 'Ramping' },
                    { id: '3', segment: '800G Ethernet & NVLink', revenue: 9800, growth: 0.64, margin: 0.715, supply: 'Balanced' },
                    { id: '4', segment: 'HBM3E Memory Stacks', revenue: 7500, growth: 0.88, margin: 0.652, supply: 'Constrained' },
                  ],
                },
                {
                  id: 'insight',
                  component: 'Callout',
                  tone: 'tip',
                  title: 'Analyst Takeaway: Inference Crosses 31% Mix',
                  body: 'Test-time reasoning models shifted cluster demand sharply toward low-latency inference silicon (+91% YoY), reducing cyclicality tied solely to pre-training runs.',
                },
                {
                  id: 'memo_artifact',
                  component: 'ArtifactCard',
                  title: 'Q3 2026 AI Semiconductor Executive Memo',
                  subtitle: 'Generated from 4 verified filings · 1,180 words',
                  kind: 'report',
                  version: 'v2',
                  preview: 'Executive Summary: Hyperscaler AI capex accelerated to $67.1B in Q3 with inference workloads driving a structural expansion in networking attach...',
                  child: 'memo_body',
                },
                {
                  id: 'memo_body',
                  component: 'Column',
                  gap: 'md',
                  children: ['memo_h1', 'memo_p1', 'memo_kv', 'memo_p2'],
                },
                { id: 'memo_h1', component: 'Text', variant: 'h2', text: 'Executive Summary & Strategic Outlook' },
                {
                  id: 'memo_p1',
                  component: 'Text',
                  variant: 'body',
                  text: 'Third-quarter earnings across the AI semiconductor supply chain confirmed **sustained structural demand** rather than an inventory digestion pause. Rack-scale deployments have pushed networking and high-bandwidth memory to **27.4% of total cluster BOM**.',
                },
                {
                  id: 'memo_kv',
                  component: 'KeyValueList',
                  title: 'Key Model Assumptions',
                  layout: 'grid',
                  items: [
                    { label: 'FY26 CoWoS Capacity', value: '680k wafers', tone: 'strong' },
                    { label: 'Inference Mix (Exit 26)', value: '36% of FLOPs', tone: 'accent' },
                    { label: 'HBM3E Bit Growth', value: '+112% YoY', tone: 'success' },
                  ],
                },
                {
                  id: 'memo_p2',
                  component: 'Text',
                  variant: 'body',
                  text: 'Key risk to monitor over the next two quarters: **power-delivery lead times** (substation transformers) and substrate packaging bottlenecks remain the primary ceiling on shipment upside.',
                },
                {
                  id: 'followups',
                  component: 'FollowUpSuggestions',
                  title: 'Continue research',
                  suggestions: [
                    {
                      label: 'Model hyperscaler capex sensitivity',
                      icon: 'sliders',
                      action: {
                        event: { name: 'drilldown_margin', userMessage: 'Run hyperscaler capex & margin sensitivity model' },
                      },
                    },
                    {
                      label: 'Inspect Q3 packaging bottlenecks',
                      icon: 'layers',
                      action: {
                        event: { name: 'drilldown_margin', userMessage: 'Drill down into CoWoS packaging & margin sensitivity' },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeDeepResearchTurn2(surfaceId: string): ReplayTurn {
  return {
    textPrefix: 'Here is the interactive capex sensitivity model comparing base, bull, and supply-constrained scenarios.',
    finalState: 'input-required',
    chunks: [
      {
        delayMs: 70,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              dataModel: {
                capexGrowth: 35,
                inferenceShare: 36,
              },
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['bar_chart', 'controls_card'],
                },
                {
                  id: 'bar_chart',
                  component: 'Chart',
                  type: 'bar',
                  title: 'FY27 Revenue Sensitivity Scenarios ($B)',
                  xKey: 'scenario',
                  valuePrefix: '$',
                  valueSuffix: 'B',
                  series: [
                    { key: 'silicon', label: 'Compute Silicon', color: 'indigo' },
                    { key: 'network', label: 'Networking', color: 'cyan' },
                  ],
                  data: [
                    { scenario: 'Bear', silicon: 148, network: 38 },
                    { scenario: 'Base', silicon: 196, network: 54 },
                    { scenario: 'Bull', silicon: 242, network: 71 },
                  ],
                },
                {
                  id: 'controls_card',
                  component: 'Card',
                  title: 'Interactive Model Assumptions',
                  children: ['sl_capex', 'sl_inf'],
                },
                {
                  id: 'sl_capex',
                  component: 'Slider',
                  label: 'Hyperscaler Capex Growth Assumption',
                  min: 10,
                  max: 70,
                  value: { '@path': '/capexGrowth' },
                  unit: '% YoY',
                },
                {
                  id: 'sl_inf',
                  component: 'Slider',
                  label: 'Reasoning / Inference Workload Share',
                  min: 15,
                  max: 65,
                  value: { '@path': '/inferenceShare' },
                  unit: '%',
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeDevopsTurn1(surfaceId: string): ReplayTurn {
  return {
    textPrefix: 'Root cause isolated in `checkout-api` (us-east-1): PgBouncer pool saturation under retry storms. Review the diff and verify staging metrics to approve the rollout.',
    finalState: 'input-required',
    chunks: [
      {
        delayMs: 60,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              dataModel: {
                canaryVerified: false,
                rolloutState: 'pending',
              },
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['alert_banner', 'triage_steps', 'latency_chart', 'diag_code', 'patch_diff', 'rollout_gate'],
                },
                {
                  id: 'alert_banner',
                  component: 'Callout',
                  tone: 'critical',
                  title: 'SEV-2 · checkout-api p99 Latency Spike (1,840ms)',
                  body: 'Connection pool saturation (25/25 active slots) triggered cascading 504 timeouts across 11.4% of Stripe webhook callbacks in us-east-1.',
                },
                {
                  id: 'triage_steps',
                  component: 'StepTimeline',
                  title: 'Automated Incident Triage',
                  steps: [
                    { id: 't1', title: 'Correlated OpenTelemetry spans', subtitle: '94% of slow traces blocked on pg_pool.acquire()', status: 'completed', timestamp: '14:02:11' },
                    { id: 't2', title: 'Ran read-only Postgres pool query', subtitle: 'Found 412 queued connections waiting > 1.5s', status: 'completed', timestamp: '14:02:14' },
                    { id: 't3', title: 'Synthesized & verified staging canary fix', subtitle: 'Canary p99 dropped from 1,840ms -> 41ms', status: 'completed', timestamp: '14:02:26' },
                    { id: 't4', title: 'Awaiting human approval for production rollout', subtitle: 'Staged progressive 10% -> 50% -> 100% deploy', status: 'active', timestamp: 'Now' },
                  ],
                },
                {
                  id: 'latency_chart',
                  component: 'Chart',
                  type: 'line',
                  title: 'checkout-api Latency Telemetry (ms)',
                  subtitle: 'us-east-1 production cluster · last 30 minutes',
                  xKey: 'time',
                  valueSuffix: 'ms',
                  height: 220,
                  series: [
                    { key: 'p99', label: 'p99 Latency', color: 'rose' },
                    { key: 'p50', label: 'p50 Median', color: 'blue' },
                  ],
                  data: [
                    { time: '13:35', p99: 52, p50: 19 },
                    { time: '13:40', p99: 68, p50: 21 },
                    { time: '13:45', p99: 420, p50: 35 },
                    { time: '13:50', p99: 1410, p50: 84 },
                    { time: '13:55', p99: 1840, p50: 112 },
                    { time: '14:00', p99: 1790, p50: 108 },
                  ],
                },
                {
                  id: 'diag_code',
                  component: 'CodeBlock',
                  filename: 'diagnostics/pg_pool_saturation.sql',
                  language: 'sql',
                  highlightLines: [3, 4],
                  code: `SELECT state, wait_event_type, count(*) AS conns
FROM pg_stat_activity
WHERE datname = 'checkout_prod'
  AND wait_event_type = 'Lock'
GROUP BY state, wait_event_type
ORDER BY conns DESC; -- 25 active, 412 queued`,
                },
                {
                  id: 'patch_diff',
                  component: 'DiffViewer',
                  filename: 'deploy/checkout-api/pgbouncer.yaml',
                  language: 'yaml',
                  viewMode: 'split',
                  before: `pool_mode: transaction
max_client_conn: 250
default_pool_size: 25
reserve_pool_size: 5
query_wait_timeout: 15`,
                  after: `pool_mode: transaction
max_client_conn: 800
default_pool_size: 80
reserve_pool_size: 20
query_wait_timeout: 5
retry_backoff_jitter: true`,
                },
                {
                  id: 'rollout_gate',
                  component: 'ApprovalCard',
                  title: 'Approve Production Hotfix Rollout (v2.14.2)',
                  description: 'Applies updated PgBouncer pool limits and jittered backoff across 12 us-east-1 pods.',
                  riskLevel: 'high',
                  state: { '@path': '/rolloutState' },
                  details: 'canary_check',
                  approveLabel: 'Deploy Hotfix to Production',
                  approveAction: {
                    event: {
                      name: 'approve_rollout',
                      userMessage: 'Approve production hotfix rollout v2.14.2',
                      context: { release: 'v2.14.2', region: 'us-east-1' },
                    },
                  },
                  rejectLabel: 'Hold & Escalate',
                  rejectAction: {
                    event: { name: 'hold_rollout', userMessage: 'Hold rollout and escalate to SRE' },
                  },
                  '@checks': [
                    {
                      condition: { '@path': '/canaryVerified' },
                      message: 'Confirm staging canary verification before deploying to production.',
                    },
                  ],
                },
                {
                  id: 'canary_check',
                  component: 'CheckBox',
                  label: 'I verified staging canary metrics (p99 41ms, 0% 5xx errors)',
                  description: 'Required safeguard before production deployment',
                  value: { '@path': '/canaryVerified' },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeDevopsTurn2(surfaceId: string): ReplayTurn {
  return {
    textPrefix: 'Hotfix `v2.14.2` rolled out cleanly across all 12 production pods. Latency recovered to 42ms p99.',
    finalState: 'completed',
    chunks: [
      {
        delayMs: 80,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['status_card', 'rollout_prog', 'postmortem_artifact'],
                },
                {
                  id: 'status_card',
                  component: 'Card',
                  title: 'checkout-api · us-east-1 Recovered',
                  subtitle: 'Release v2.14.2 active on 12/12 pods',
                  headerTrailing: 'healthy_badge',
                  child: 'recovery_kv',
                },
                {
                  id: 'healthy_badge',
                  component: 'StatusBadge',
                  label: 'Healthy · p99 42ms',
                  tone: 'success',
                  pulse: true,
                },
                {
                  id: 'recovery_kv',
                  component: 'KeyValueList',
                  items: [
                    { label: 'Deploy ID', value: 'rel-2026-1119-v2142', mono: true, copyable: true },
                    { label: 'p99 Latency', value: '42ms (down from 1,840ms)', tone: 'success' },
                    { label: 'Error Rate (5xx)', value: '0.00%', tone: 'success' },
                    { label: 'Active Pool Slots', value: '29 / 80 (36% utilization)' },
                  ],
                },
                {
                  id: 'rollout_prog',
                  component: 'ProgressIndicator',
                  label: 'Progressive Canary Stages Complete',
                  sublabel: 'Stage 4/4: 100% traffic serving healthy',
                  value: 100,
                  variant: 'segmented',
                  segments: 4,
                  tone: 'success',
                },
                {
                  id: 'postmortem_artifact',
                  component: 'ArtifactCard',
                  title: 'Incident Postmortem Draft — INC-4921',
                  subtitle: 'Auto-generated timeline & prevention action items',
                  kind: 'document',
                  version: 'Draft',
                  preview: 'Root Cause: Default PgBouncer pool size (25) saturated under bursty webhook retries...',
                  child: 'pm_body',
                },
                {
                  id: 'pm_body',
                  component: 'Text',
                  variant: 'body',
                  text: '### Action Items\n- Add automated alert threshold at **70% pool saturation**\n- Enforce jittered exponential backoff in Stripe webhook worker\n- Add load test gate for 1,000 concurrent checkouts in CI',
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeWealthTurn1(surfaceId: string): ReplayTurn {
  return {
    textPrefix: 'I audited your recurring expenses and identified $186/mo in underused subscriptions. Toggle which ones to cancel and adjust your monthly ETF allocation below.',
    finalState: 'input-required',
    chunks: [
      {
        delayMs: 70,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              dataModel: {
                viewMode: 'optimize',
                monthlyReinvest: 450,
                savings: 186,
                subscriptions: [
                  { name: 'Cloud Storage Pro (2TB)', cost: '$19.99 / mo · Unused 90d', cancel: true },
                  { name: 'Streaming Bundle Ultra', cost: '$34.99 / mo · 1h watched', cancel: true },
                  { name: 'Design Suite Seat #2', cost: '$64.00 / mo · Idle seat', cancel: true },
                  { name: 'AI Research Plus', cost: '$20.00 / mo · Used daily', cancel: false },
                ],
              },
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['kpi_row', 'donut_chart', 'mode_seg', 'subs_card', 'sim_card', 'rebalance_gate'],
                },
                {
                  id: 'kpi_row',
                  component: 'Grid',
                  columns: 2,
                  children: ['stat_save', 'stat_reinvest'],
                },
                {
                  id: 'stat_save',
                  component: 'StatMetric',
                  label: 'Reclaimable Monthly Spend',
                  value: { '@call': 'formatCurrency', args: { value: { '@path': '/savings' }, currency: 'USD' } },
                  delta: '$2,232 / yr',
                  trend: 'up',
                  caption: '3 idle subscriptions detected',
                },
                {
                  id: 'stat_reinvest',
                  component: 'StatMetric',
                  label: 'Monthly Auto-Invest Target',
                  value: { '@call': 'formatCurrency', args: { value: { '@path': '/monthlyReinvest' }, currency: 'USD' } },
                  delta: '8.2% hist. CAGR',
                  trendSentiment: 'positive',
                  caption: 'Slide below to update live',
                },
                {
                  id: 'donut_chart',
                  component: 'Chart',
                  type: 'donut',
                  title: 'Monthly Cashflow Breakdown',
                  xKey: 'category',
                  valuePrefix: '$',
                  series: [{ key: 'amount', label: 'Monthly Spend' }],
                  data: [
                    { category: 'Housing & Utilities', amount: 2850 },
                    { category: 'Index ETF Auto-Invest', amount: 1200 },
                    { category: 'Dining & Travel', amount: 740 },
                    { category: 'Subscriptions', amount: 268 },
                  ],
                },
                {
                  id: 'mode_seg',
                  component: 'SegmentedControl',
                  value: { '@path': '/viewMode' },
                  options: [
                    { label: 'Optimize Subscriptions', value: 'optimize' },
                    { label: 'Index Allocation', value: 'allocate' },
                    { label: 'Tax Harvest', value: 'tax' },
                  ],
                },
                {
                  id: 'subs_card',
                  component: 'Card',
                  title: 'Recurring Subscriptions Audit',
                  subtitle: 'Toggle switches on to queue cancellation',
                  child: 'subs_list',
                },
                {
                  id: 'subs_list',
                  component: 'List',
                  dividers: true,
                  children: { path: '/subscriptions', componentId: 'sub_item_tpl' },
                },
                {
                  id: 'sub_item_tpl',
                  component: 'Switch',
                  label: { '@path': 'name' },
                  description: { '@path': 'cost' },
                  value: { '@path': 'cancel' },
                },
                {
                  id: 'sim_card',
                  component: 'Card',
                  title: 'Live Reinvestment Simulator',
                  children: ['reinvest_slider'],
                },
                {
                  id: 'reinvest_slider',
                  component: 'Slider',
                  label: 'Additional Monthly ETF Contribution (VTI / VXUS)',
                  min: 100,
                  max: 1500,
                  steps: 28,
                  value: { '@path': '/monthlyReinvest' },
                  unit: 'USD/mo',
                },
                {
                  id: 'rebalance_gate',
                  component: 'ApprovalCard',
                  title: 'Queue Cancellations & Update Auto-Invest',
                  description: 'Cancels selected idle subscriptions and updates your recurring monthly VTI transfer.',
                  riskLevel: 'low',
                  approveLabel: 'Apply Optimization Plan',
                  approveAction: {
                    event: {
                      name: 'apply_rebalance',
                      userMessage: 'Apply subscription cancellations and ETF rebalance',
                      context: {
                        monthlyReinvest: { '@path': '/monthlyReinvest' },
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeWealthTurn2(surfaceId: string, context: Record<string, unknown>): ReplayTurn {
  const amt = Number(context.monthlyReinvest ?? 450);
  const fiveYr = Math.round(amt * 12 * 5 * 1.22);
  return {
    textPrefix: 'Optimization plan applied! Your recurring transfer and cancellations are scheduled.',
    finalState: 'completed',
    chunks: [
      {
        delayMs: 80,
        messages: [
          {
            version: '1.0',
            createSurface: {
              surfaceId,
              catalogId: LUMINA_V1_CATALOG_ID,
              components: [
                {
                  id: 'root',
                  component: 'Column',
                  gap: 'lg',
                  children: ['done_callout', 'receipt_kv'],
                },
                {
                  id: 'done_callout',
                  component: 'Callout',
                  tone: 'success',
                  title: 'Wealth Plan Active',
                  body: `Scheduled 3 subscription cancellations and updated monthly VTI auto-invest to $${amt}/mo (projected ~$${fiveYr.toLocaleString()} in 5 years).`,
                },
                {
                  id: 'receipt_kv',
                  component: 'KeyValueList',
                  title: 'Execution Summary',
                  items: [
                    { label: 'Reference ID', value: 'WLT-2026-904', mono: true, copyable: true },
                    { label: 'Monthly ETF Transfer', value: `$${amt}.00 / mo`, tone: 'accent' },
                    { label: 'Projected 5-Year Value', value: `$${fiveYr.toLocaleString()}`, tone: 'success' },
                    { label: 'Next Execution Date', value: '1st of next month' },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

export function resolveReplayTurn(input: {
  query: string;
  actionName?: string;
  actionContext?: Record<string, unknown>;
  turnCounter: number;
}): ReplayTurn {
  const { query, actionName, actionContext = {}, turnCounter } = input;
  const q = query.toLowerCase();
  const sid = `lumina-turn-${turnCounter}`;

  if (actionName === 'select_flight') return makeTokyoTurn2(sid, actionContext);
  if (actionName === 'confirm_booking') return makeTokyoTurn3(sid, actionContext);
  if (actionName === 'restart_travel') return makeTokyoTurn1(sid);
  if (actionName === 'drilldown_margin') return makeDeepResearchTurn2(sid);
  if (actionName === 'approve_rollout') return makeDevopsTurn2(sid);
  if (actionName === 'apply_rebalance') return makeWealthTurn2(sid, actionContext);

  if (q.includes('tokyo') || q.includes('flight') || q.includes('travel') || q.includes('hotel')) {
    return makeTokyoTurn1(sid);
  }
  if (
    q.includes('semiconductor') ||
    q.includes('research') ||
    q.includes('capex') ||
    q.includes('margin') ||
    q.includes('q3')
  ) {
    return makeDeepResearchTurn1(sid);
  }
  if (
    q.includes('checkout') ||
    q.includes('latency') ||
    q.includes('incident') ||
    q.includes('devops') ||
    q.includes('hotfix') ||
    q.includes('p99')
  ) {
    return makeDevopsTurn1(sid);
  }
  if (
    q.includes('subscription') ||
    q.includes('wealth') ||
    q.includes('etf') ||
    q.includes('savings') ||
    q.includes('rebalance')
  ) {
    return makeWealthTurn1(sid);
  }

  return makeTokyoTurn1(sid);
}

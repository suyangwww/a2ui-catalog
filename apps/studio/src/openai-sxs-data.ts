import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';
import { SXS_IMAGES } from './openai-sxs-assets';

export interface OpenAiSxsShowcaseItem {
  id:
    | 'roth-ira'
    | 'dinner-ledger'
    | 'pixel-palace'
    | 'bicycle-7speed'
    | 'sf-one-day'
    | 'lamb-roast'
    | 'dog-vest'
    | 'gdp-clt-quiz';
  indexLabel: string;
  shortTitle: string;
  title: string;
  prompt: string;
  sourceBadge: string;
  iframeUrl?: string;
  componentsUsed: string[];
  functionsUsed: string[];
  parityNote: string;
  messages: Record<string, unknown>[];
}

function surface(
  surfaceId: string,
  components: Array<Record<string, unknown>>,
  dataModel?: Record<string, unknown>,
): Record<string, unknown>[] {
  return [
    {
      version: '1.0',
      createSurface: {
        surfaceId,
        catalogId: LUMINA_V1_CATALOG_ID,
        ...(dataModel ? { dataModel } : {}),
        components,
      },
    },
  ];
}

export const OPENAI_SXS_SHOWCASES: OpenAiSxsShowcaseItem[] = [
  // =========================================================================
  // 01. ROTH IRA GROWTH CALCULATOR (Official OpenAI CDN HTML vs. Lumina v1.0)
  // =========================================================================
  {
    id: 'roth-ira',
    indexLabel: '01',
    shortTitle: 'Roth IRA Calculator',
    title: 'Illustrative Roth IRA Growth Calculator',
    prompt: 'Show me how does a roth IRA work',
    sourceBadge: 'Official OpenAI CDN Demo (roth-calculator-v4.html)',
    iframeUrl: '/openai-refs/roth-calculator-v4.html',
    componentsUsed: ['Card', 'Text', 'ProportionBar', 'Divider', 'Slider'],
    functionsUsed: ['compoundGrowth', 'formatCurrency', 'formatString'],
    parityNote:
      'Matches OpenAI’s exact $416,129 ($180,000 contributions + $236,129 growth) monthly annuity math in 0ms RTT via compoundGrowth + ProportionBar + Slider marks.',
    messages: surface(
      'sxs-roth-ira',
      [
        {
          id: 'root',
          component: 'Card',
          variant: 'outlined',
          padding: 'lg',
          children: ['intro_col', 'split_bar', 'div', 'sliders_col', 'disclaimer'],
        },
        {
          id: 'intro_col',
          component: 'Column',
          gap: 'xs',
          children: ['calc_label', 'hero_balance', 'proj_sub'],
        },
        {
          id: 'calc_label',
          component: 'Text',
          variant: 'caption',
          tone: 'secondary',
          text: 'Illustrative Roth IRA growth calculator',
        },
        {
          id: 'hero_balance',
          component: 'Text',
          variant: 'h1',
          tone: 'success',
          tabularNums: true,
          text: {
            '@call': 'formatCurrency',
            args: {
              value: {
                '@call': 'compoundGrowth',
                args: {
                  initial: 0,
                  monthly: { '@path': '/monthly' },
                  years: { '@path': '/years' },
                  annualRate: { '@path': '/rate' },
                  metric: 'total',
                },
              },
              currency: 'USD',
              decimals: 0,
            },
          },
        },
        {
          id: 'proj_sub',
          component: 'Text',
          variant: 'caption',
          tone: 'secondary',
          text: {
            '@call': 'formatString',
            args: {
              value: 'Projected balance after ${/years} years',
            },
          },
        },
        {
          id: 'split_bar',
          component: 'ProportionBar',
          variant: 'split',
          segments: [
            {
              id: 'contributions',
              label: 'Your contributions',
              color: 'blue',
              value: {
                '@call': 'compoundGrowth',
                args: {
                  initial: 0,
                  monthly: { '@path': '/monthly' },
                  years: { '@path': '/years' },
                  annualRate: { '@path': '/rate' },
                  metric: 'contributions',
                },
              },
              formattedValue: {
                '@call': 'formatCurrency',
                args: {
                  value: {
                    '@call': 'compoundGrowth',
                    args: {
                      initial: 0,
                      monthly: { '@path': '/monthly' },
                      years: { '@path': '/years' },
                      annualRate: { '@path': '/rate' },
                      metric: 'contributions',
                    },
                  },
                  currency: 'USD',
                  decimals: 0,
                },
              },
            },
            {
              id: 'growth',
              label: 'Investment growth',
              color: 'emerald',
              value: {
                '@call': 'compoundGrowth',
                args: {
                  initial: 0,
                  monthly: { '@path': '/monthly' },
                  years: { '@path': '/years' },
                  annualRate: { '@path': '/rate' },
                  metric: 'growth',
                },
              },
              formattedValue: {
                '@call': 'formatCurrency',
                args: {
                  value: {
                    '@call': 'compoundGrowth',
                    args: {
                      initial: 0,
                      monthly: { '@path': '/monthly' },
                      years: { '@path': '/years' },
                      annualRate: { '@path': '/rate' },
                      metric: 'growth',
                    },
                  },
                  currency: 'USD',
                  decimals: 0,
                },
              },
            },
          ],
        },
        { id: 'div', component: 'Divider' },
        {
          id: 'sliders_col',
          component: 'Column',
          gap: 'md',
          children: ['sl_monthly', 'sl_years', 'sl_rate'],
        },
        {
          id: 'sl_monthly',
          component: 'Slider',
          label: 'Monthly contribution',
          min: 0,
          max: 625,
          step: 25,
          valuePrefix: '$',
          value: { '@path': '/monthly' },
          marks: [
            { value: 0, label: '$0' },
            { value: 300, label: '$300' },
            { value: 625, label: '$625' },
          ],
        },
        {
          id: 'sl_years',
          component: 'Slider',
          label: 'Years invested',
          min: 5,
          max: 45,
          step: 5,
          unit: 'years',
          value: { '@path': '/years' },
          marks: [
            { value: 5, label: '5' },
            { value: 25, label: '25' },
            { value: 45, label: '45' },
          ],
        },
        {
          id: 'sl_rate',
          component: 'Slider',
          label: 'Annual return (assumed)',
          min: 0,
          max: 12,
          step: 1,
          unit: '%',
          value: { '@path': '/rate' },
          marks: [
            { value: 0, label: '0%' },
            { value: 6, label: '6%' },
            { value: 12, label: '12%' },
          ],
        },
        {
          id: 'disclaimer',
          component: 'Text',
          variant: 'caption',
          tone: 'secondary',
          text: 'Assumes monthly deposits at the end of each month and a constant return compounded monthly. Actual investments fluctuate, and this illustration excludes fees and inflation.',
        },
      ],
      { monthly: 500, years: 30, rate: 5 },
    ),
  },

  // =========================================================================
  // 02. THE DINNER LEDGER (Official OpenAI CDN HTML vs. Lumina SplitLedger)
  // =========================================================================
  {
    id: 'dinner-ledger',
    indexLabel: '02',
    shortTitle: 'Dinner Ledger',
    title: 'The Check, Please · Party of Five Clipboard Splitter',
    prompt: 'Bill splitter for a party of five based on what we ate, can you make it look like a clipboard',
    sourceBadge: 'Official OpenAI CDN Demo (bill-splitter-v5.html)',
    iframeUrl: '/openai-refs/bill-splitter-v5.html',
    componentsUsed: ['Column', 'Row', 'Image', 'Text', 'SplitLedger'],
    functionsUsed: ['copyToClipboard'],
    parityNote:
      'Rebuilds the tactile clipboard, editable 5-guest roster, 6 Trattoria dishes ($99 + $8.78 tax = $107.78), tip presets, and cent-exact largest-remainder FINAL RECEIPT.',
    messages: surface('sxs-dinner-ledger', [
      {
        id: 'root',
        component: 'Column',
        gap: 'md',
        children: ['receipt_bar', 'ledger'],
      },
      {
        id: 'receipt_bar',
        component: 'Row',
        justify: 'spaceBetween',
        align: 'center',
        gap: 'md',
        children: ['receipt_note', 'receipt_thumb'],
      },
      {
        id: 'receipt_note',
        component: 'Text',
        variant: 'caption',
        tone: 'secondary',
        text: 'Parsed from uploaded Trattoria receipt ($99.00 food & wine + $8.78 tax = **$107.78**). Tap receipt to zoom.',
      },
      {
        id: 'receipt_thumb',
        component: 'Image',
        url: SXS_IMAGES.trattoriaReceipt,
        description: 'Trattoria Roma Receipt · Table 05 ($107.78)',
        variant: 'smallFeature',
        aspectRatio: '16:9',
        zoomable: true,
      },
      {
        id: 'ledger',
        component: 'SplitLedger',
        variant: 'clipboard',
        eyebrow: 'THE DINNER LEDGER',
        title: 'The Check, Please.',
        subtitle: 'TABLE OF FIVE · ITEMIZED BILL',
        footerNote: 'GOOD FOOD. FAIR SPLITS. NO MATH.',
        guests: ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5'],
        items: [
          { id: 'item-1', name: 'Margherita', price: 14, sharedBy: [0] },
          { id: 'item-2', name: 'Margherita', price: 14, sharedBy: [1] },
          { id: 'item-3', name: 'Cacio e Pepe', price: 16, sharedBy: [2] },
          { id: 'item-4', name: 'Rigatoni Vodka', price: 17, sharedBy: [3] },
          { id: 'item-5', name: 'Insalata', price: 14, sharedBy: [4] },
          { id: 'item-6', name: 'House Red (L)', price: 24, sharedBy: [0, 1, 2, 3, 4] },
        ],
        taxAmount: 8.78,
        taxMode: 'amount',
        tipPercent: 0,
        tipPresets: [15, 18, 20, 25],
      },
    ]),
  },

  // =========================================================================
  // 03. PIXEL PALACE RETRO ARCADE & DRUM LAB 01 (Official CDN + Drum Lab)
  // =========================================================================
  {
    id: 'pixel-palace',
    indexLabel: '03',
    shortTitle: 'Retro Arcade & Drum Lab',
    title: 'Pixel Palace 8-Bit Console & Drum Lab 01',
    prompt: 'Create a retro interactive gaming console that I can play — plus a 16-step WebAudio drum machine',
    sourceBadge: 'Official OpenAI CDN Demo (retro-game-player-v3.html) + ChatGPT Drum Lab',
    iframeUrl: '/openai-refs/retro-game-player-v3.html',
    componentsUsed: ['Column', 'Tabs', 'MicroApp', 'Callout'],
    functionsUsed: [],
    parityNote:
      'Pairs playable 60fps Snake / Breakout / Pong on the PIXELBOY handheld console with a 16-step synthesized WebAudio Drum Lab inside MicroApp.',
    messages: surface('sxs-pixel-palace', [
      {
        id: 'root',
        component: 'Column',
        gap: 'md',
        children: ['tabs', 'sandbox_note'],
      },
      {
        id: 'tabs',
        component: 'Tabs',
        variant: 'segmented',
        tabs: [
          { title: 'Pixel Palace Console', child: 'arcade_app', badge: '3 Games' },
          { title: 'Drum Lab 01', child: 'drum_app', badge: '16-Step' },
        ],
      },
      {
        id: 'arcade_app',
        component: 'MicroApp',
        preset: 'retro-arcade',
        title: 'PIXEL PALACE',
        badge: '1989 EDITION',
        defaultGame: 'snake',
      },
      {
        id: 'drum_app',
        component: 'MicroApp',
        preset: 'drum-sequencer',
        title: 'DRUM / LAB 01',
        subtitle: 'Rhythm playground · 16-step WebAudio machine',
        badge: 'READY',
      },
      {
        id: 'sandbox_note',
        component: 'Callout',
        tone: 'info',
        title: 'Built-In Presets + Sandboxed Escape Hatch',
        body: 'MicroApp ships native theme-aware presets for 60fps arcade games and WebAudio synthesis, plus a strict sandbox="allow-scripts" iframe mode with CSP blocking network egress.',
      },
    ]),
  },

  // =========================================================================
  // 04. 7-SPEED BICYCLE SCHEMATIC (ChatGPT Intelligent UI Hero Diagram)
  // =========================================================================
  {
    id: 'bicycle-7speed',
    indexLabel: '04',
    shortTitle: '7-Speed Bicycle',
    title: 'How a 7-Speed Commuter Bicycle Works',
    prompt: 'Explain how a 7-speed commuter bicycle drivetrain, brakes, and steering work interactively',
    sourceBadge: 'OpenAI GPT-6 Intelligent UI Showcase',
    componentsUsed: ['Column', 'AnnotatedDiagram', 'Card', 'Slider', 'Grid', 'StatMetric'],
    functionsUsed: ['computeMath', 'formatNumber', 'formatString'],
    parityNote:
      'Interactive SVG schematic with spring-animated subsystem pills, clickable numbered pins, animated chain dash, and live gear-ratio physics.',
    messages: surface(
      'sxs-bicycle',
      [
        {
          id: 'root',
          component: 'Column',
          gap: 'md',
          children: ['diagram', 'gear_card'],
        },
        {
          id: 'diagram',
          component: 'AnnotatedDiagram',
          title: '7-Speed Commuter Bicycle',
          subtitle: 'Filter by subsystem or tap numbered pins to inspect mechanical assemblies',
          preset: 'bicycle-7speed',
          value: { '@path': '/subsystem' },
          activeStep: { '@path': '/gear' },
          cadence: { '@path': '/cadence' },
          groups: [
            { id: 'all', label: 'All systems' },
            { id: 'drivetrain', label: 'Drivetrain' },
            { id: 'control', label: 'Brakes & Steering' },
            { id: 'frame', label: 'Frame & Wheels' },
          ],
          hotspots: [
            {
              id: 'cassette',
              group: 'drivetrain',
              x: 24,
              y: 63,
              label: '7-Cog Rear Cassette & Derailleur',
              badge: '11–28T',
              detail: 'Moves the chain across seven sprockets: large 28T cog multiplies climbing torque; small 11T cog maximizes flat-road speed.',
            },
            {
              id: 'crankset',
              group: 'drivetrain',
              x: 46,
              y: 66,
              label: '44T Front Chainring & Crank',
              badge: '44T',
              detail: 'Converts rider foot force on the pedals into linear chain tension along the lower run.',
            },
            {
              id: 'shifter',
              group: 'control',
              x: 64,
              y: 20,
              label: 'Indexed Cockpit Shifter & Levers',
              badge: 'Cockpit',
              detail: 'Each thumb click pulls a precise millimeter step of derailleur cable while dual caliper levers modulate rim braking.',
            },
            {
              id: 'triangle',
              group: 'frame',
              x: 48,
              y: 42,
              label: 'Double-Diamond Chromoly Triangle',
              badge: 'Structure',
              detail: 'Two triangulated trusses resist pedaling flex while keeping weight centered between 700c commuter wheels.',
            },
          ],
        },
        {
          id: 'gear_card',
          component: 'Card',
          title: 'Interactive Gear & Cadence Bench',
          subtitle: 'Shift from climbing Gear 1 (28T) to sprint Gear 7 (11T)',
          children: ['gear_sliders', 'gear_stats'],
        },
        {
          id: 'gear_sliders',
          component: 'Grid',
          columns: 2,
          minItemWidth: 210,
          gap: 'md',
          children: ['sl_gear', 'sl_rpm'],
        },
        {
          id: 'sl_gear',
          component: 'Slider',
          label: 'Selected rear gear',
          min: 1,
          max: 7,
          step: 1,
          value: { '@path': '/gear' },
          marks: [
            { value: 1, label: 'Gear 1 (Climb)' },
            { value: 4, label: 'Gear 4' },
            { value: 7, label: 'Gear 7 (Fast)' },
          ],
        },
        {
          id: 'sl_rpm',
          component: 'Slider',
          label: 'Pedal cadence',
          min: 50,
          max: 110,
          step: 5,
          unit: 'RPM',
          value: { '@path': '/cadence' },
          marks: [
            { value: 50, label: '50' },
            { value: 80, label: '80' },
            { value: 110, label: '110' },
          ],
        },
        {
          id: 'gear_stats',
          component: 'Grid',
          columns: 2,
          minItemWidth: 180,
          gap: 'sm',
          children: ['stat_ratio', 'stat_speed'],
        },
        {
          id: 'stat_ratio',
          component: 'StatMetric',
          label: 'Gear Ratio (Wheel Rev / Pedal)',
          value: {
            '@call': 'formatString',
            args: {
              value: "${formatNumber(value: ${computeMath(op: 'add', a: 1.25, b: ${computeMath(op: 'mul', a: ${/gear}, b: 0.38)})}, decimals: 2)}x",
            },
          },
          delta: '44T chainring',
          trend: 'up',
        },
        {
          id: 'stat_speed',
          component: 'StatMetric',
          label: 'Estimated Road Speed',
          value: {
            '@call': 'formatString',
            args: {
              value: "${formatNumber(value: ${computeMath(op: 'mul', a: ${/cadence}, b: ${computeMath(op: 'add', a: 0.16, b: ${computeMath(op: 'mul', a: ${/gear}, b: 0.045)})})}, decimals: 1)} km/h",
            },
          },
          delta: '700x32c tires',
          trend: 'up',
          trendSentiment: 'positive',
        },
      ],
      { subsystem: 'all', gear: 4, cadence: 80 },
    ),
  },

  // =========================================================================
  // 05. SAN FRANCISCO IN ONE DAY (ChatGPT Route Map, Photos & Fleet Week)
  // =========================================================================
  {
    id: 'sf-one-day',
    indexLabel: '05',
    shortTitle: 'San Francisco Route',
    title: 'San Francisco in One Day · 9 AM–7 PM Route',
    prompt: 'Plan a 9 AM–7 PM San Francisco sightseeing route starting downtown and finishing with sunset views',
    sourceBadge: 'OpenAI GPT-6 Intelligent UI Showcase',
    componentsUsed: ['Column', 'Text', 'Grid', 'Image', 'Callout', 'SourceList', 'RouteMap', 'StepTimeline'],
    functionsUsed: [],
    parityNote:
      'Matches the 3-photo landmark strip, Fleet Week Blue Angels grounding citation, interactive SF Bay RouteMap with category filter + Expand sheet, and timed stops.',
    messages: surface(
      'sxs-sf-route',
      [
        {
          id: 'root',
          component: 'Column',
          gap: 'md',
          children: ['intro_head', 'intro_body', 'photo_strip', 'fleet_callout', 'sources', 'sf_map', 'itinerary'],
        },
        {
          id: 'intro_head',
          component: 'Text',
          variant: 'h3',
          text: 'San Francisco in one day',
        },
        {
          id: 'intro_body',
          component: 'Text',
          variant: 'body',
          tone: 'secondary',
          text: 'I’d plan a **9 AM–7 PM route** that starts downtown, takes you through the city’s iconic streets and waterfront, and finishes with panoramic views at sunset.',
        },
        {
          id: 'photo_strip',
          component: 'Grid',
          columns: 3,
          minItemWidth: 140,
          gap: 'sm',
          children: ['img_ggb', 'img_lombard', 'img_palace'],
        },
        {
          id: 'img_ggb',
          component: 'Image',
          url: SXS_IMAGES.sfGoldenGate,
          description: 'Golden Gate Bridge from Crissy Field Promenade',
          aspectRatio: '4:3',
          variant: 'rounded',
          zoomable: true,
        },
        {
          id: 'img_lombard',
          component: 'Image',
          url: SXS_IMAGES.sfLombard,
          description: 'Lombard Street Eight Hairpin Switchbacks',
          aspectRatio: '4:3',
          variant: 'rounded',
          zoomable: true,
        },
        {
          id: 'img_palace',
          component: 'Image',
          url: SXS_IMAGES.sfPalace,
          description: 'Palace of Fine Arts Lagoon Reflection',
          aspectRatio: '4:3',
          variant: 'rounded',
          zoomable: true,
        },
        {
          id: 'fleet_callout',
          component: 'Callout',
          tone: 'tip',
          title: 'Bonus if you’re going today: Fleet Week',
          body: 'The Blue Angels practice over the waterfront between 1 PM and 5 PM — time Fisherman’s Wharf & Crissy Field for clear bay sightlines.',
        },
        {
          id: 'sources',
          component: 'SourceList',
          variant: 'pills',
          sources: [
            {
              id: 'sfc',
              title: 'San Francisco Chronicle · Fleet Week Air Show Schedule',
              url: 'https://www.sfchronicle.com',
              domain: 'San Francisco Chronicle',
              index: 1,
            },
          ],
        },
        {
          id: 'sf_map',
          component: 'RouteMap',
          regionPreset: 'sf-bay',
          value: { '@path': '/selectedStop' },
          expandable: true,
          height: 300,
          stops: [
            {
              id: 'ferry',
              title: 'Ferry Building',
              subtitle: 'Artisan coffee & bayfront arcade',
              time: '9:00 AM',
              category: 'Food',
              lat: 37.7955,
              lng: -122.3937,
              detourNote: 'Grab Blue Bottle espresso + Acme bread by Pier 1.',
            },
            {
              id: 'chinatown',
              title: 'Chinatown + Cable Car',
              subtitle: 'Dragon Gate walk & Powell-Hyde climb',
              time: '10:30 AM',
              category: 'Culture',
              lat: 37.7908,
              lng: -122.4056,
              detourNote: 'Golden Gate Fortune Cookie Factory on Ross Alley.',
            },
            {
              id: 'lombard',
              title: 'Lombard Street',
              subtitle: 'Hydrangea-lined brick switchbacks',
              time: '12:00 PM',
              category: 'Views',
              lat: 37.8021,
              lng: -122.4187,
            },
            {
              id: 'wharf',
              title: 'Pier 39 · Fisherman’s Wharf',
              subtitle: 'Sea lions & sourdough chowder',
              time: '1:15 PM',
              category: 'Food',
              lat: 37.8087,
              lng: -122.4098,
              detourNote: 'Prime deck for 1:30 PM Blue Angels flyover.',
            },
            {
              id: 'palace',
              title: 'Palace of Fine Arts',
              subtitle: 'Greco-Roman rotunda & lagoon',
              time: '3:15 PM',
              category: 'Culture',
              lat: 37.8029,
              lng: -122.4484,
            },
            {
              id: 'crissy',
              title: 'Crissy Field & Painted Ladies',
              subtitle: 'Golden Gate promenade -> Alamo Square sunset',
              time: '5:00 PM',
              category: 'Views',
              lat: 37.8039,
              lng: -122.4647,
            },
          ],
        },
        {
          id: 'itinerary',
          component: 'StepTimeline',
          title: 'Timed Day Plan (9 AM – 7 PM)',
          steps: [
            { id: 't1', title: 'Downtown & Chinatown Cable Car', subtitle: 'Ferry Building -> Dragon Gate -> Hyde St crest', status: 'completed', timestamp: '9:00 AM' },
            { id: 't2', title: 'Waterfront & Fleet Week Practice', subtitle: 'Lombard switchbacks -> Pier 39 sea lions -> Marina green', status: 'active', timestamp: '1:00 PM' },
            { id: 't3', title: 'Golden Gate & Alamo Square Sunset', subtitle: 'Palace of Fine Arts -> Crissy Field -> Painted Ladies', status: 'pending', timestamp: '4:30 PM' },
          ],
        },
      ],
      { selectedStop: 'ferry' },
    ),
  },

  // =========================================================================
  // 06. SUNDAY LAMB ROAST (ChatGPT Menu, Guest Shopping Scaler & Checklist)
  // =========================================================================
  {
    id: 'lamb-roast',
    indexLabel: '06',
    shortTitle: 'Sunday Lamb Roast',
    title: 'Mediterranean Sunday Roast · Live Guest Scaler & Checklist',
    prompt: 'Plan a Mediterranean Sunday roast for 6 guests (1 vegetarian) with adjustable shopping quantities and a live prep checklist',
    sourceBadge: 'OpenAI GPT-6 Intelligent UI Showcase (chatgpt-3-examples)',
    componentsUsed: ['Column', 'Grid', 'Card', 'Image', 'Text', 'StepperInput', 'KeyValueList', 'Button', 'ChecklistCard'],
    functionsUsed: ['computeMath', 'formatNumber', 'formatString', 'copyToClipboard'],
    parityNote:
      'Adjusting Total guests or Vegetarians recalculates lamb shoulder, cauliflower, potatoes, feta, and pita quantities live via computeMath + ChecklistCard.',
    messages: surface(
      'sxs-lamb-roast',
      [
        {
          id: 'root',
          component: 'Column',
          gap: 'md',
          children: ['dishes_grid', 'scaler_card', 'cook_checklist'],
        },
        {
          id: 'dishes_grid',
          component: 'Grid',
          columns: 2,
          minItemWidth: 210,
          gap: 'sm',
          children: ['dish_salad', 'dish_cake'],
        },
        {
          id: 'dish_salad',
          component: 'Card',
          variant: 'subtle',
          padding: 'sm',
          children: ['img_salad', 'txt_salad_eye', 'txt_salad_title', 'txt_salad_desc'],
        },
        {
          id: 'img_salad',
          component: 'Image',
          url: SXS_IMAGES.herbSalad,
          description: 'Tomato, cucumber & herb salad',
          aspectRatio: '16:9',
          variant: 'rounded',
        },
        { id: 'txt_salad_eye', component: 'Text', variant: 'overline', tone: 'tertiary', text: 'FRESH SIDE' },
        { id: 'txt_salad_title', component: 'Text', variant: 'h3', text: 'Tomato, cucumber & herb salad' },
        { id: 'txt_salad_desc', component: 'Text', variant: 'caption', tone: 'secondary', text: 'Cherry tomatoes, cucumber, red onion, parsley, mint & red-wine vinaigrette.' },
        {
          id: 'dish_cake',
          component: 'Card',
          variant: 'subtle',
          padding: 'sm',
          children: ['img_cake', 'txt_cake_eye', 'txt_cake_title', 'txt_cake_desc'],
        },
        {
          id: 'img_cake',
          component: 'Image',
          url: SXS_IMAGES.oliveCake,
          description: 'Orange & olive oil cake',
          aspectRatio: '16:9',
          variant: 'rounded',
        },
        { id: 'txt_cake_eye', component: 'Text', variant: 'overline', tone: 'tertiary', text: 'DESSERT' },
        { id: 'txt_cake_title', component: 'Text', variant: 'h3', text: 'Orange & olive oil cake' },
        { id: 'txt_cake_desc', component: 'Text', variant: 'caption', tone: 'secondary', text: 'With Greek yogurt, honey and pistachios. Made the previous day.' },
        {
          id: 'scaler_card',
          component: 'Card',
          title: 'Shopping quantities — adjust as RSVPs come in',
          subtitle: 'Vegetarian guests get spiced whole roasted cauliflower; all sides are shared.',
          children: ['steppers_grid', 'shopping_kv', 'copy_btn'],
        },
        {
          id: 'steppers_grid',
          component: 'Grid',
          columns: 2,
          minItemWidth: 200,
          gap: 'md',
          children: ['step_guests', 'step_veg'],
        },
        {
          id: 'step_guests',
          component: 'StepperInput',
          label: 'Total guests',
          min: 2,
          max: 16,
          value: { '@path': '/guests' },
        },
        {
          id: 'step_veg',
          component: 'StepperInput',
          label: 'Vegetarians',
          min: 0,
          max: 8,
          value: { '@path': '/veg' },
        },
        {
          id: 'shopping_kv',
          component: 'KeyValueList',
          dividers: true,
          items: [
            {
              label: 'Bone-in lamb shoulder',
              tone: 'strong',
              value: {
                '@call': 'formatString',
                args: {
                  value: "${formatNumber(value: ${computeMath(op: 'mul', a: ${computeMath(op: 'clamp', a: ${computeMath(op: 'sub', a: ${/guests}, b: ${/veg})}, b: 0, c: 16)}, b: 0.46)}, decimals: 1)} kg",
                },
              },
            },
            {
              label: 'Whole spiced cauliflower',
              value: {
                '@call': 'formatString',
                args: {
                  value: "${computeMath(op: 'ceil', a: ${computeMath(op: 'div', a: ${computeMath(op: 'clamp', a: ${/veg}, b: 1, c: 12)}, b: 2)})} large",
                },
              },
            },
            {
              label: 'Lemon-oregano potatoes',
              value: {
                '@call': 'formatString',
                args: {
                  value: "${formatNumber(value: ${computeMath(op: 'mul', a: ${/guests}, b: 0.3)}, decimals: 1)} kg",
                },
              },
            },
            {
              label: 'Barrel-aged feta & hummus',
              value: {
                '@call': 'formatString',
                args: {
                  value: "${computeMath(op: 'mul', a: ${/guests}, b: 45)} g feta · ${computeMath(op: 'mul', a: ${/guests}, b: 50)} g hummus",
                },
              },
            },
            {
              label: 'Warm pita bread',
              value: {
                '@call': 'formatString',
                args: {
                  value: "${computeMath(op: 'ceil', a: ${computeMath(op: 'mul', a: ${/guests}, b: 1.35)})} pieces",
                },
              },
            },
          ],
        },
        {
          id: 'copy_btn',
          component: 'Button',
          label: 'Copy shopping quantities',
          variant: 'secondary',
          icon: 'copy',
          fullWidth: true,
          action: {
            functionCall: {
              '@call': 'copyToClipboard',
              args: {
                text: 'Sunday Roast Shopping List copied',
                label: 'Shopping quantities copied to clipboard',
              },
            },
          },
        },
        {
          id: 'cook_checklist',
          component: 'ChecklistCard',
          title: 'Sunday Cooking Timeline',
          subtitle: 'Check off steps from Saturday bake through 2:00 PM carving',
          value: { '@path': '/checkedSteps' },
          items: [
            { id: 'c1', title: 'Bake orange & olive oil cake', time: 'Sat PM', badge: 'Make ahead', detail: 'Cool completely in tin so citrus syrup settles overnight.' },
            { id: 'c2', title: 'Score lamb shoulder & rub garlic-herb paste', time: '9:30 AM', badge: 'Prep', detail: '4 cloves garlic, rosemary, oregano, lemon zest & olive oil.' },
            { id: 'c3', title: 'Slow-roast covered at 160°C over lemon & wine', time: '10:00 AM', badge: 'Oven · 3h' },
            { id: 'c4', title: 'Roast spiced cauliflower & potatoes at 210°C', time: '1:00 PM', badge: 'Crisp' },
            { id: 'c5', title: 'Toss tomato-herb salad & warm pita', time: '1:45 PM', badge: 'Fresh' },
          ],
        },
      ],
      { guests: 6, veg: 1, checkedSteps: ['c1', 'c2'] },
    ),
  },

  // =========================================================================
  // 07. DOG VEST MOODBOARD (ChatGPT Gallery ChoicePicker + SwatchPicker)
  // =========================================================================
  {
    id: 'dog-vest',
    indexLabel: '07',
    shortTitle: 'Dog Vest Moodboard',
    title: 'Dog Vest Moodboard · Three Design Directions',
    prompt: 'Give me three design directions for a stylish, functional dog vest with fabric details and colorways',
    sourceBadge: 'OpenAI GPT-6 Intelligent UI Showcase (chatgpt-3-examples)',
    componentsUsed: ['Column', 'ChoicePicker', 'Card', 'Text', 'Grid', 'Image', 'SwatchPicker'],
    functionsUsed: ['selectByValue', 'formatString'],
    parityNote:
      'Gallery ChoicePicker renders 3 portrait concept cards with emerald checkmarks; selecting a direction updates the material spec card via selectByValue + SwatchPicker.',
    messages: surface(
      'sxs-dog-vest',
      [
        {
          id: 'root',
          component: 'Column',
          gap: 'md',
          children: ['vibe_picker', 'detail_card'],
        },
        {
          id: 'vibe_picker',
          component: 'ChoicePicker',
          label: 'Three design directions for a stylish, functional dog vest. Pick a vibe to explore.',
          variant: 'mutuallyExclusive',
          displayStyle: 'gallery',
          value: { '@path': '/vibe' },
          options: [
            {
              value: 'trail',
              eyebrow: '01 · Trail utility',
              label: 'Trail utility',
              description: 'Cordura ripstop, MOLLE webbing & grab handle',
              imageUrl: SXS_IMAGES.vestTrail,
            },
            {
              value: 'urban',
              eyebrow: '02 · Urban minimal',
              label: 'Urban minimal',
              description: 'Matte bonded neoprene & reflective seam piping',
              imageUrl: SXS_IMAGES.vestUrban,
            },
            {
              value: 'cozy',
              eyebrow: '03 · Cozy premium',
              label: 'Cozy premium',
              description: 'Quilted oat bouclé shell & brushed fleece lining',
              imageUrl: SXS_IMAGES.vestCozy,
            },
          ],
        },
        {
          id: 'detail_card',
          component: 'Card',
          title: {
            '@call': 'selectByValue',
            args: {
              value: { '@path': '/vibe/0' },
              cases: {
                trail: '01 · Trail utility — Rugged, sporty, built for adventures',
                urban: '02 · Urban minimal — Clean architectural lines for city walks',
                cozy: '03 · Cozy premium — Soft quilted warmth for crisp mornings',
              },
              fallback: 'Trail utility',
            },
          },
          subtitle: {
            '@call': 'formatString',
            args: {
              value: 'Selected colorway: ${/swatch}',
            },
          },
          children: ['macro_grid', 'palette_swatches'],
        },
        {
          id: 'macro_grid',
          component: 'Grid',
          columns: 2,
          minItemWidth: 180,
          gap: 'sm',
          children: ['img_fabric', 'img_hardware'],
        },
        {
          id: 'img_fabric',
          component: 'Image',
          url: SXS_IMAGES.fabricRipstop,
          description: 'Fabric inspiration · DWR water-beading 420D ripstop weave',
          aspectRatio: '16:9',
          variant: 'rounded',
          zoomable: true,
        },
        {
          id: 'img_hardware',
          component: 'Image',
          url: SXS_IMAGES.hardwareBuckle,
          description: 'Hardware & details · Anodized quick-release chest buckle',
          aspectRatio: '16:9',
          variant: 'rounded',
          zoomable: true,
        },
        {
          id: 'palette_swatches',
          component: 'SwatchPicker',
          label: 'Color direction',
          variant: 'circle',
          size: 'md',
          value: { '@path': '/swatch' },
          swatches: [
            { value: 'Olive', label: 'Olive', hex: '#636B46' },
            { value: 'Graphite', label: 'Graphite', hex: '#2B2E33' },
            { value: 'Sand', label: 'Sand', hex: '#D4C5AA' },
            { value: 'Rust', label: 'Rust', hex: '#C86428' },
            { value: 'Slate', label: 'Slate', hex: '#4A7292' },
          ],
        },
      ],
      { vibe: ['trail'], swatch: 'Olive' },
    ),
  },

  // =========================================================================
  // 08. GDP, CENTRAL LIMIT THEOREM & QUIZ (ChatGPT STEM Simulators + Quiz)
  // =========================================================================
  {
    id: 'gdp-clt-quiz',
    indexLabel: '08',
    shortTitle: 'GDP, CLT & Quiz',
    title: 'Interactive STEM · GDP Identity, Central Limit Theorem & Quiz',
    prompt: 'Explain GDP (C + I + G + NX) and the Central Limit Theorem interactively, then quiz me',
    sourceBadge: 'OpenAI GPT-6 Intelligent UI Showcase (STEM + Quiz)',
    componentsUsed: ['Column', 'Tabs', 'Card', 'ProportionBar', 'Slider', 'SegmentedControl', 'Button', 'Chart', 'QuizCard'],
    functionsUsed: ['computeMath', 'selectByValue', 'runSimulation', 'formatString'],
    parityNote:
      'Combines live macroeconomic C+I+G+NX ProportionBar, client-side Monte Carlo Central Limit Theorem sampling via runSimulation, and a 3-question QuizCard.',
    messages: surface(
      'sxs-stem-quiz',
      [
        {
          id: 'root',
          component: 'Column',
          gap: 'md',
          children: ['stem_tabs', 'stem_quiz'],
        },
        {
          id: 'stem_tabs',
          component: 'Tabs',
          variant: 'segmented',
          tabs: [
            { title: 'GDP Formula (C+I+G+NX)', child: 'gdp_card' },
            { title: 'Central Limit Theorem', child: 'clt_card' },
          ],
        },
        {
          id: 'gdp_card',
          component: 'Card',
          title: {
            '@call': 'formatString',
            args: {
              value: "Total GDP (Y) = $${computeMath(op: 'sum', a: ${/gdp/c}, b: ${/gdp/i}, c: ${/gdp/g}, d: ${/gdp/nx})}B",
            },
          },
          subtitle: 'Adjust Consumer (C), Investment (I), Government (G), and Net Exports (NX)',
          children: ['gdp_bar', 'gdp_sliders'],
        },
        {
          id: 'gdp_bar',
          component: 'ProportionBar',
          variant: 'inlineLabels',
          unitPrefix: '$',
          unitSuffix: 'B',
          negativeNote: {
            '@call': 'selectByValue',
            args: {
              value: { '@path': '/gdp/nx' },
              whenNegative: 'Trade deficit (NX < 0): imports exceed exports, subtracting from domestic output.',
              whenNonNegative: '',
            },
          },
          segments: [
            { id: 'c', label: 'Consumer (C)', value: { '@path': '/gdp/c' }, color: 'blue' },
            { id: 'i', label: 'Investment (I)', value: { '@path': '/gdp/i' }, color: 'emerald' },
            { id: 'g', label: 'Government (G)', value: { '@path': '/gdp/g' }, color: 'indigo' },
            { id: 'nx', label: 'Net Exports (NX)', value: { '@path': '/gdp/nx' }, color: 'amber' },
          ],
        },
        {
          id: 'gdp_sliders',
          component: 'Grid',
          columns: 2,
          minItemWidth: 200,
          gap: 'sm',
          children: ['sl_c', 'sl_i', 'sl_g', 'sl_nx'],
        },
        { id: 'sl_c', component: 'Slider', label: 'Consumption (C)', min: 200, max: 900, step: 25, valuePrefix: '$', unit: 'B', value: { '@path': '/gdp/c' } },
        { id: 'sl_i', component: 'Slider', label: 'Investment (I)', min: 50, max: 500, step: 25, valuePrefix: '$', unit: 'B', value: { '@path': '/gdp/i' } },
        { id: 'sl_g', component: 'Slider', label: 'Government (G)', min: 50, max: 500, step: 25, valuePrefix: '$', unit: 'B', value: { '@path': '/gdp/g' } },
        { id: 'sl_nx', component: 'Slider', label: 'Net Exports (NX)', min: -150, max: 150, step: 25, valuePrefix: '$', unit: 'B', value: { '@path': '/gdp/nx' } },
        {
          id: 'clt_card',
          component: 'Card',
          title: 'Central Limit Theorem · Monte Carlo Sampler',
          subtitle: {
            '@call': 'formatString',
            args: {
              value: 'Samples drawn: ${/clt/sampleCount} · Mean of means: ${/clt/meanOfMeans} · Spread: ${/clt/spreadOfMeans}',
            },
          },
          children: ['clt_controls', 'clt_btns', 'clt_chart'],
        },
        {
          id: 'clt_controls',
          component: 'Grid',
          columns: 2,
          minItemWidth: 190,
          gap: 'sm',
          children: ['clt_dist', 'clt_n'],
        },
        {
          id: 'clt_dist',
          component: 'SegmentedControl',
          label: 'Population shape',
          value: { '@path': '/cltDist' },
          options: [
            { label: 'Skewed', value: 'Skewed' },
            { label: 'Bimodal', value: 'Bimodal' },
            { label: 'Uniform', value: 'Uniform' },
          ],
        },
        {
          id: 'clt_n',
          component: 'Slider',
          label: 'Sample size (n)',
          min: 2,
          max: 40,
          step: 2,
          value: { '@path': '/cltN' },
        },
        {
          id: 'clt_btns',
          component: 'Row',
          gap: 'sm',
          wrap: true,
          children: ['btn_draw100', 'btn_draw500', 'btn_reset_clt'],
        },
        {
          id: 'btn_draw100',
          component: 'Button',
          label: 'Draw +100 samples',
          variant: 'primary',
          icon: 'sparkles',
          action: {
            functionCall: {
              '@call': 'runSimulation',
              args: {
                mode: 'cltDraw',
                path: '/clt',
                distribution: { '@path': '/cltDist' },
                sampleSize: { '@path': '/cltN' },
                count: 100,
              },
            },
          },
        },
        {
          id: 'btn_draw500',
          component: 'Button',
          label: 'Draw +500',
          variant: 'tonal',
          action: {
            functionCall: {
              '@call': 'runSimulation',
              args: {
                mode: 'cltDraw',
                path: '/clt',
                distribution: { '@path': '/cltDist' },
                sampleSize: { '@path': '/cltN' },
                count: 500,
              },
            },
          },
        },
        {
          id: 'btn_reset_clt',
          component: 'Button',
          label: 'Reset',
          variant: 'ghost',
          action: {
            functionCall: {
              '@call': 'runSimulation',
              args: {
                mode: 'cltReset',
                path: '/clt',
                distribution: { '@path': '/cltDist' },
                sampleSize: { '@path': '/cltN' },
              },
            },
          },
        },
        {
          id: 'clt_chart',
          component: 'Chart',
          type: 'bar',
          title: 'Distribution of Sample Means (Bell Curve Convergence)',
          data: { '@path': '/clt/sampleBins' },
          xKey: 'bin',
          height: 190,
          showLegend: false,
          series: [{ key: 'count', label: 'Sample Means', color: 'emerald' }],
        },
        {
          id: 'stem_quiz',
          component: 'QuizCard',
          title: 'Check Your Understanding',
          subtitle: 'Answer one question at a time with instant feedback & score tracking',
          showScore: true,
          questions: [
            {
              id: 'q1',
              prompt: 'If imports rise by $80B while domestic consumption, investment, and government spending stay unchanged, what happens to GDP?',
              hint: 'Recall NX = Exports - Imports inside Y = C + I + G + NX.',
              correctOptionId: 'b',
              options: [
                { id: 'a', label: 'GDP increases by $80B because total spending rose.', explanation: 'Imports were produced abroad, so NX falls when imports rise alone.' },
                { id: 'b', label: 'Net exports (NX) fall by $80B, lowering headline GDP by $80B.', explanation: 'Because NX = Exports - Imports, higher standalone imports reduce NX by $80B.' },
                { id: 'c', label: 'Government spending (G) automatically offsets the change.', explanation: 'G measures public purchases, not private trade balances.' },
              ],
            },
            {
              id: 'q2',
              prompt: 'Even when a population is heavily skewed, what happens to sample means as sample size n grows?',
              hint: 'Standard error shrinks by 1 / sqrt(n).',
              correctOptionId: 'a',
              options: [
                { id: 'a', label: 'They form a tighter bell-shaped normal curve around the true mean.', explanation: 'Averaging n independent draws cancels extremes and converges to Normal.' },
                { id: 'b', label: 'They become bimodal with two symmetric peaks.', explanation: 'Sample means unimodally cluster around the population mean.' },
                { id: 'c', label: 'Their spread widens linearly with n.', explanation: 'Spread narrows proportionally to 1/sqrt(n).' },
              ],
            },
          ],
        },
      ],
      {
        gdp: { c: 600, i: 225, g: 200, nx: 50 },
        cltDist: 'Skewed',
        cltN: 12,
        clt: {
          means: [],
          sampleCount: '250',
          meanOfMeans: '0.251',
          spreadOfMeans: '0.074',
          theorySpread: '0.074',
          sampleBins: [
            { bin: '0.06', count: 2 },
            { bin: '0.12', count: 14 },
            { bin: '0.18', count: 48 },
            { bin: '0.25', count: 96 },
            { bin: '0.31', count: 61 },
            { bin: '0.38', count: 23 },
            { bin: '0.44', count: 6 },
          ],
        },
      },
    ),
  },
];

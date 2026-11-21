import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';

export interface WalkthroughChapter {
  id: string;
  timeLabel: string;
  startSec: number;
  title: string;
  caption: string;
}

export interface DeeperTourItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
}

export interface HomeDemoScenario {
  id: 'dinner' | 'savings' | 'approve';
  tabLabel: string;
  prompt: string;
  plainTextParagraphs: string[];
  luminaBadge: string;
  luminaHint: string;
  messages: Record<string, unknown>[];
}

export interface HomeCatalogItem {
  human: string;
  dev: string;
  desc: string;
}

export interface HomeCatalogFamily {
  id: string;
  label: string;
  headline: string;
  summary: string;
  items: HomeCatalogItem[];
}

export const QUICK_TOUR_VIDEO = {
  videoUrl: '/media/lumina-quick-walkthrough-narrated.mp4',
  posterUrl: '/media/poster-quick-walkthrough.png',
  durationLabel: '1:03',
};

export const QUICK_TOUR_CHAPTERS: WalkthroughChapter[] = [
  {
    id: 'beyond-text',
    timeLabel: '0:00',
    startSec: 0,
    title: '1. Beyond Plain Text',
    caption:
      'Instead of making people read paragraphs of numbers and options, Lumina lets an AI assistant reply with clean visual cards people can scan and tap in seconds.',
  },
  {
    id: 'tap-and-drag',
    timeLabel: '0:14',
    startSec: 14,
    title: '2. Tap & Drag Live',
    caption:
      'People do not have to type follow-up messages just to test different numbers—sliders, switches, and bill splitters recalculate right on screen.',
  },
  {
    id: 'maps-and-docs',
    timeLabel: '0:28',
    startSec: 28,
    title: '3. Sources & Side Docs',
    caption:
      'Answers stay easy to verify with clickable source links, interactive charts, and summary cards that open long reports neatly in a side panel.',
  },
  {
    id: 'human-signoff',
    timeLabel: '0:40',
    startSec: 40,
    title: '4. Human Sign-Off',
    caption:
      'Before an AI books a hotel, moves money, or applies a change, built-in approval gates keep the confirm button safely locked until a person checks off.',
  },
  {
    id: 'every-screen',
    timeLabel: '0:51',
    startSec: 51,
    title: '5. Computer + Phone',
    caption:
      'The AI sends one simple data message—never raw code—and Lumina adapts every layout automatically across laptop, tablet, and phone in Light and Dark mode.',
  },
];

export const DEEPER_TOURS: DeeperTourItem[] = [
  {
    id: 'studio-sxs',
    title: 'Web × Mobile Live Studio',
    description: '4 multi-turn workflows running on laptop and phone side by side.',
    duration: '1:55',
    videoUrl: '/media/lumina-hero-agent-studio-narrated.mp4',
    posterUrl: '/media/poster-hero-studio-sxs.png',
  },
  {
    id: 'openai-sxs',
    title: 'ChatGPT UI Side-by-Side',
    description: '8 flagship interactive UIs rebuilt with Lumina building blocks.',
    duration: '2:54',
    videoUrl: '/media/lumina-openai-intelligent-ui-sxs-narrated.mp4',
    posterUrl: '/media/poster-openai-sxs.png',
  },
  {
    id: 'components-tour',
    title: 'Complete Component Tour',
    description: 'Property definitions, Light/Dark themes, and device adaptation.',
    duration: '4:11',
    videoUrl: '/media/lumina-components-deep-dive-narrated.mp4',
    posterUrl: '/media/poster-components-walkthrough.png',
  },
];

export const HOME_DEMO_SCENARIOS: HomeDemoScenario[] = [
  {
    id: 'dinner',
    tabLabel: 'Split a Dinner Bill',
    prompt: 'Split our $84 dinner check between Maya, Sam, and Jordan with tax and tip.',
    plainTextParagraphs: [
      '“Okay! The Wood-Fired Pizza ($28.00), Truffle Pasta ($32.00), and Crispy Brussels ($24.00) come to an $84.00 subtotal. Adding $7.35 tax and a 20% tip ($16.80) brings the total to $108.15—which is $36.05 each if shared evenly.',
      'Reply if Sam didn’t have the pasta, or if you want me to recalculate with an 18% or 22% tip instead!”',
    ],
    luminaBadge: 'With Lumina · Interactive Split Bill',
    luminaHint: 'Tap dish names or tip % presets',
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'home-demo-dinner',
          catalogId: LUMINA_V1_CATALOG_ID,
          components: [
            {
              id: 'root',
              component: 'SplitLedger',
              variant: 'card',
              eyebrow: 'GROUP DINNER CHECK',
              title: 'Table for Three',
              subtitle: 'Tap who shared each dish or adjust tip %',
              guests: ['Maya', 'Sam', 'Jordan'],
              items: [
                { id: 'd1', name: 'Wood-Fired Margherita', price: 28, sharedBy: [0, 1, 2] },
                { id: 'd2', name: 'Truffle Tagliatelle', price: 32, sharedBy: [0, 1, 2] },
                { id: 'd3', name: 'Crispy Brussels Sprouts', price: 24, sharedBy: [0, 1, 2] },
              ],
              taxAmount: 7.35,
              tipPercent: 20,
              tipPresets: [15, 18, 20, 22],
              defaultExpandedReceipt: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'savings',
    tabLabel: 'Plan Monthly Savings',
    prompt: 'Show how saving $500 a month grows over 30 years.',
    plainTextParagraphs: [
      '“If you invest $500 per month for 30 years at an assumed 5% annual return compounded monthly, your total contributions will be $180,000 and your estimated investment growth will be $236,129, giving a projected balance of $416,129.',
      'Let me know if you’d like me to re-run the math for $600/month, 20 years, or a 7% return!”',
    ],
    luminaBadge: 'With Lumina · Live Growth Calculator',
    luminaHint: 'Drag sliders for 0ms recalculation',
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'home-demo-savings',
          catalogId: LUMINA_V1_CATALOG_ID,
          dataModel: { monthly: 500, years: 30, rate: 5 },
          components: [
            {
              id: 'root',
              component: 'Card',
              variant: 'outlined',
              padding: 'md',
              children: ['header_col', 'split_bar', 'div', 'sliders_col'],
            },
            {
              id: 'header_col',
              component: 'Column',
              gap: 'xs',
              children: ['eyebrow', 'total_val', 'sub_caption'],
            },
            {
              id: 'eyebrow',
              component: 'Text',
              variant: 'caption',
              tone: 'secondary',
              text: 'Projected savings balance',
            },
            {
              id: 'total_val',
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
              id: 'sub_caption',
              component: 'Text',
              variant: 'caption',
              tone: 'secondary',
              text: {
                '@call': 'formatString',
                args: { value: 'After ${/years} years at ${/rate}% assumed annual return' },
              },
            },
            {
              id: 'split_bar',
              component: 'ProportionBar',
              variant: 'split',
              segments: [
                {
                  id: 'contrib',
                  label: 'Deposited',
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
              gap: 'sm',
              children: ['sl_monthly', 'sl_years', 'sl_rate'],
            },
            {
              id: 'sl_monthly',
              component: 'Slider',
              label: 'Monthly deposit',
              min: 100,
              max: 1000,
              step: 50,
              valuePrefix: '$',
              value: { '@path': '/monthly' },
            },
            {
              id: 'sl_years',
              component: 'Slider',
              label: 'Years invested',
              min: 5,
              max: 40,
              step: 5,
              unit: 'yrs',
              value: { '@path': '/years' },
            },
            {
              id: 'sl_rate',
              component: 'Slider',
              label: 'Annual return',
              min: 2,
              max: 10,
              step: 1,
              unit: '%',
              value: { '@path': '/rate' },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'approve',
    tabLabel: 'Approve a Booking',
    prompt: 'Book 3 nights at Hotel Toranomon Hills in Tokyo for May 12–15.',
    plainTextParagraphs: [
      '“I am ready to charge $1,240.00 to your Visa ending in 4821 for 3 nights at Hotel Toranomon Hills (May 12–15, non-refundable executive rate).',
      'Please read the cancellation rules carefully and reply CONFIRM BOOKING if you want me to charge your card.”',
    ],
    luminaBadge: 'With Lumina · Human Safety Gate',
    luminaHint: 'Check the box to unlock approval',
    messages: [
      {
        version: '1.0',
        createSurface: {
          surfaceId: 'home-demo-approve',
          catalogId: LUMINA_V1_CATALOG_ID,
          dataModel: {
            confirmedPolicy: false,
            bookingState: 'pending',
          },
          components: [
            {
              id: 'root',
              component: 'Column',
              gap: 'md',
              children: ['summary_kv', 'booking_gate'],
            },
            {
              id: 'summary_kv',
              component: 'KeyValueList',
              title: 'Reservation Summary',
              items: [
                { label: 'Hotel', value: 'Hotel Toranomon Hills · Tokyo', tone: 'strong' },
                { label: 'Check-in → Check-out', value: 'May 12 – May 15 (3 nights)' },
                { label: 'Total Charge', value: '$1,240.00 · Visa •••• 4821', tone: 'accent' },
              ],
            },
            {
              id: 'booking_gate',
              component: 'ApprovalCard',
              title: 'Confirm Hotel Charge ($1,240.00)',
              description: 'Non-refundable executive rate · Instant confirmation receipt.',
              riskLevel: 'medium',
              state: { '@path': '/bookingState' },
              details: 'policy_check',
              approveLabel: 'Approve & Book ($1,240)',
              approveAction: { event: { name: 'confirm_hotel_booking', context: { amount: 1240 } } },
              rejectLabel: 'Hold Room Only',
              rejectAction: { event: { name: 'hold_hotel_room' } },
              '@checks': [
                {
                  condition: { '@path': '/confirmedPolicy' },
                  message: 'Tick the date and policy box above to unlock booking.',
                },
              ],
            },
            {
              id: 'policy_check',
              component: 'CheckBox',
              label: 'I verified the May 12–15 dates and non-refundable rate',
              value: { '@path': '/confirmedPolicy' },
            },
          ],
        },
      },
    ],
  },
];

export const HOME_CATALOG_FAMILIES: HomeCatalogFamily[] = [
  {
    id: 'numbers',
    label: 'Numbers & Charts (9)',
    headline: 'Turn raw numbers into clear visual takeaways',
    summary:
      'Spotlight headline figures, plot interactive charts, sort tables, compare options side by side, or split a group bill down to the cent.',
    items: [
      { human: 'Headline Metric Card', dev: 'StatMetric', desc: 'Big KPI number with +/- change pill and mini sparkline.' },
      { human: 'Interactive Chart', dev: 'Chart', desc: 'Area, line, bar, stacked bar, or donut chart with hover & touch scrub.' },
      { human: 'Sortable Table', dev: 'DataTable', desc: 'Clean rows with formatted currency, percentages, and status pills.' },
      { human: 'Option Comparison', dev: 'ComparisonMatrix', desc: 'Side-by-side table on laptop; swipeable cards on phone.' },
      { human: 'Proportion Split Bar', dev: 'ProportionBar', desc: 'Visual share breakdown (such as principal vs. investment growth).' },
      { human: 'Party Bill Splitter', dev: 'SplitLedger', desc: 'Itemized shared dishes, tax/tip presets, and per-person totals.' },
      { human: 'Summary Receipt Rows', dev: 'KeyValueList', desc: 'Clean label-and-value list with one-click copy.' },
      { human: 'Interactive Quiz', dev: 'QuizCard', desc: 'Multiple-choice comprehension check with hints and explanations.' },
      { human: 'Next-Step Suggestions', dev: 'FollowUpSuggestions', desc: 'Tap-to-send follow-up pills at the bottom of a reply.' },
    ],
  },
  {
    id: 'inputs',
    label: 'Taps & Sliders (10)',
    headline: 'Let people tap, toggle, and drag instead of typing',
    summary:
      'Controls update on-screen numbers immediately so users can explore choices without typing extra follow-up messages.',
    items: [
      { human: 'Action Button', dev: 'Button', desc: 'Primary, secondary, subtle, or destructive tap button.' },
      { human: 'Range Slider', dev: 'Slider', desc: 'Smooth drag bar for budgets, years, or percentages.' },
      { human: 'Plus / Minus Counter', dev: 'StepperInput', desc: 'Quick whole-number counter for guests, seats, or nights.' },
      { human: 'Sliding Mode Switch', dev: 'SegmentedControl', desc: '2–4 option pill switcher (for example: Economy / Business).' },
      { human: 'Visual Option Picker', dev: 'ChoicePicker', desc: 'Single or multi-select chips, cards, or photo gallery.' },
      { human: 'Color & Finish Swatches', dev: 'SwatchPicker', desc: 'Tactile color circles or material palettes.' },
      { human: 'On / Off Toggle', dev: 'Switch', desc: 'Instant preference switch.' },
      { human: 'Confirmation Checkbox', dev: 'CheckBox', desc: 'Explicit tick box for selections or safety verification.' },
      { human: 'Text Input Box', dev: 'TextField', desc: 'Short note, email, or search field with one-tap clear.' },
      { human: 'Date & Time Picker', dev: 'DateTimeInput', desc: 'Clean calendar date and time selector.' },
    ],
  },
  {
    id: 'thinking',
    label: 'Progress & Sign-Off (5)',
    headline: 'Show what the AI is doing—and pause before real-world actions',
    summary:
      'Build trust while the assistant works, and require explicit human approval before spending money or applying changes.',
    items: [
      { human: 'Reasoning Summary', dev: 'ThoughtTrace', desc: 'Calm, expandable summary of how the AI worked out an answer.' },
      { human: 'Live Step Tracker', dev: 'StepTimeline', desc: 'Ordered progress through multi-step tasks.' },
      { human: 'Human Approval Gate', dev: 'ApprovalCard', desc: 'Clear Approve / Reject card that stays locked until checks pass.' },
      { human: 'Progress Meter', dev: 'ProgressIndicator', desc: 'Bar, circular ring, or multi-stage rollout meter.' },
      { human: 'Interactive Checklist', dev: 'ChecklistCard', desc: 'Tickable step-by-step prep list or runbook.' },
    ],
  },
  {
    id: 'media',
    label: 'Maps, Diagrams & Media (9)',
    headline: 'Explain places, parts, and people visually',
    summary:
      'Plot multi-stop routes on a street map, pin clickable callouts onto diagrams, or play spoken briefings inline.',
    items: [
      { human: 'Multi-Stop Street Map', dev: 'RouteMap', desc: 'Numbered stops and route path on an interactive basemap.' },
      { human: 'Labeled Diagram', dev: 'AnnotatedDiagram', desc: 'Visual schematic with clickable hotspot pins.' },
      { human: 'Formatted Text', dev: 'Text', desc: 'Headings, readable paragraphs, and clean Markdown lists.' },
      { human: 'Zoomable Image', dev: 'Image', desc: 'Photo or illustration with smooth tap-to-zoom.' },
      { human: 'Status Pill', dev: 'StatusBadge', desc: 'Semantic pill badge (Confirmed, Live, Action Needed).' },
      { human: 'Profile Badge', dev: 'Avatar', desc: 'Person or assistant avatar with live status dot.' },
      { human: 'Built-in Symbol', dev: 'Icon', desc: '83 crisp built-in everyday icons.' },
      { human: 'Inline Video Clip', dev: 'Video', desc: 'Clean video player with preview poster.' },
      { human: 'Audio Briefing Player', dev: 'AudioPlayer', desc: 'Voice note or summary player with playback speed.' },
    ],
  },
  {
    id: 'sources',
    label: 'Sources & Side Docs (6)',
    headline: 'Back up claims with sources and keep long documents tidy',
    summary:
      'Attach verifiable web links, highlight before/after text edits, and open long reports in a clean side panel.',
    items: [
      { human: 'Cited Sources', dev: 'SourceList', desc: 'Clickable reference cards or compact citation pills.' },
      { human: 'Expandable Side Report', dev: 'ArtifactCard', desc: 'Opens long memos in a desktop side panel or phone bottom sheet.' },
      { human: 'Highlighted Takeaway', dev: 'Callout', desc: 'Note, tip, or warning banner with optional action.' },
      { human: 'Before / After Diff', dev: 'DiffViewer', desc: 'Highlights exact added and removed lines.' },
      { human: 'Formatted Code Snippet', dev: 'CodeBlock', desc: 'Syntax-highlighted snippet with one-click copy.' },
      { human: 'Sandboxed Mini-Canvas', dev: 'MicroApp', desc: 'Isolated interactive simulation, synth, or canvas.' },
    ],
  },
  {
    id: 'layout',
    label: 'Clean Layouts (10)',
    headline: 'Organize complex answers without visual clutter',
    summary:
      'Group related items into responsive multi-column grids, swipeable card rails, tabs, and mobile-friendly bottom sheets.',
    items: [
      { human: 'Responsive Bento Grid', dev: 'Grid', desc: '3 columns on desktop → 2 on tablet → 1 on phone.' },
      { human: 'Swipeable Card Rail', dev: 'Carousel', desc: 'Touch-friendly horizontal scroll of cards.' },
      { human: 'Content Card', dev: 'Card', desc: 'Clean framed box with title, body, and footer.' },
      { human: 'View Tabs', dev: 'Tabs', desc: 'Switch between multiple views inside one space.' },
      { human: 'Collapsible Sections', dev: 'Accordion', desc: 'Keep optional Q&A or details tucked away.' },
      { human: 'Dialog / Bottom Sheet', dev: 'Modal', desc: 'Centered dialog on desktop; draggable sheet on phone.' },
      { human: 'Repeating Row List', dev: 'List', desc: 'Clean vertical rows with optional dividers.' },
      { human: 'Side-by-Side Row', dev: 'Row', desc: 'Horizontal alignment container.' },
      { human: 'Vertical Stack', dev: 'Column', desc: 'Top-to-bottom stack with consistent spacing.' },
      { human: 'Section Divider', dev: 'Divider', desc: 'Subtle separator line with optional label.' },
    ],
  },
];

# A2UI Lumina Catalog — Component & Function Specification (`v1.0`)

**Catalog ID:** `https://wsyang0309.github.io/a2ui-catalog/specification/v1_0/lumina/catalog.json`  
**Protocol Version:** `"1.0"`  
**Total Components:** `49` (`18` Superset-Compatible Basic Primitives + `31` Agentic & Intelligent UI Primitives)  
**Total Functions:** `24` (`14` Standard Basic Functions + `10` Agentic & Reactive Math Functions)

> [!IMPORTANT]
> **Normative Contract for Code Generation.**  
> Every component and function in `@a2ui-catalog/core` and `@a2ui-catalog/react` MUST match the exact identifier casing (UAX #31 compliant), property names, `Dynamic*` bindings, `Child` / `ChildList` references, and `Checkable` / `Action` envelopes specified in this document.

---

## 1. Common Schema Primitives & Envelope Rules (`v1.0`)

All components inherit A2UI v1.0 envelope rules automatically via `@a2ui/web_core/v1_0`:

- **Component Envelope Keys:** `id` (`string`, `"root"` for surface root), `component` (`const` string), `@catalogId` (`string?`), `@accessibility` (`{ label?: DynamicString, description?: DynamicString }?`), `@metadata` (`object?`).
- **Common Layout Property (`weight`):** Every component accepts optional `weight?: number` (`#/$defs/Weight`), applied as CSS `flex: <weight> 1 0%` when rendered as a direct child of `Row` or `Column`.
- **Dynamic Value Types (`@a2ui/web_core/v1_0`):**
  - `DynamicString`: `string | { "@path": string } | { "@call": string, args?: object }`
  - `DynamicNumber`: `number | { "@path": string } | { "@call": string, args?: object }`
  - `DynamicBoolean`: `boolean | { "@path": string } | { "@call": string, args?: object }`
  - `DynamicStringList`: `string[] | { "@path": string } | { "@call": string, args?: object }`
  - `DynamicValue`: `any | { "@path": string } | { "@call": string, args?: object }`
- **Topology Reference Types:**
  - `Child` (`ComponentIdSchema`): `string` ID of a child component in the surface's flat `components` array.
  - `ChildList` (`ChildListSchema`): `string[]` OR `{ componentId: string, path: string }` (`TemplateChildList`).
- **Validation Mixin (`Checkable`):** Components marked **Checkable** accept `@checks?: Array<{ condition: DataBinding | FunctionCall, message?: string }>` and expose error messages via `validationErrorsRef`.

---

## 2. Category 1: Layout & Containers (10 Components)

### 2.1 `Row` *(Basic Catalog Superset)*
Horizontal flex layout container.
- **Properties:**
  - `children` (`ChildList`, **required**): Child component IDs or template descriptor.
  - `justify` (`enum: ['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch']`, default `'start'`)
  - `align` (`enum: ['start', 'center', 'end', 'stretch', 'baseline']`, default `'center'`)
  - `gap` (`enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl']`, default `'md'` — `0, 4, 8, 12, 16, 24px`)
  - `wrap` (`boolean`, default `false`; automatically wraps on `< 480px` mobile if content overflows unless `nowrap` is forced)
  - `weight` (`number?`)

### 2.2 `Column` *(Basic Catalog Superset)*
Vertical flex stack container.
- **Properties:**
  - `children` (`ChildList`, **required**)
  - `justify` (`enum: ['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch']`, default `'start'`)
  - `align` (`enum: ['start', 'center', 'end', 'stretch']`, default `'stretch'`)
  - `gap` (`enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl']`, default `'md'`)
  - `weight` (`number?`)

### 2.3 `Grid` *(New Agentic Primitive)*
Responsive 2D bento grid for KPI cards, entity galleries, and structured dashboards.
- **Properties:**
  - `children` (`ChildList`, **required**)
  - `columns` (`number`, integer `1..6`, default `2`): Desktop target column count; automatically collapses to `2` on tablet (`< 900px`) and `1` on narrow mobile (`< 560px`) unless `minItemWidth` governs auto-fit.
  - `minItemWidth` (`number?`, pixels, e.g., `220`): When set, uses `repeat(auto-fit, minmax(min(100%, <minItemWidth>px), 1fr))`.
  - `gap` (`enum: ['xs', 'sm', 'md', 'lg']`, default `'md'`)
  - `weight` (`number?`)
- **Motion:** Staggered child entrance (`35ms` per cell).

### 2.4 `List` *(Basic Catalog Superset)*
Ordered vertical or horizontal collection optimized for `TemplateChildList` + `@index` data-model expansion.
- **Properties:**
  - `children` (`ChildList`, **required**)
  - `direction` (`enum: ['vertical', 'horizontal']`, default `'vertical'`)
  - `align` (`enum: ['start', 'center', 'end', 'stretch']`, default `'stretch'`)
  - `dividers` (`boolean`, default `false`): Renders Apple Inset Grouped hairline dividers between items.
  - `gap` (`enum: ['none', 'xs', 'sm', 'md', 'lg']`, default `'sm'`)
  - `weight` (`number?`)

### 2.5 `Carousel` *(New Agentic Primitive)*
Touch-first horizontal snap rail for hotels, flights, products, or media cards.
- **Properties:**
  - `children` (`ChildList`, **required**)
  - `title` (`DynamicString?`): Optional rail header title.
  - `itemWidth` (`enum: ['compact', 'standard', 'wide', 'full']`, default `'standard'` — `200px`, `280px`, `360px`, `100%`)
  - `showIndicators` (`boolean`, default `true`): Pagination dots on mobile + frosted glass chevron buttons on desktop hover.
  - `weight` (`number?`)
- **Mobile & Motion:** Native `scroll-snap-type: x mandatory` with overscroll rubber-band feel and keyboard Left/Right arrow navigation.

### 2.6 `Card` *(Basic Catalog Superset)*
Primary elevated surface container with optical border concentricity.
- **Properties:**
  - `child` (`Child?`): Legacy single-child slot (supported for 100% Basic Catalog parity).
  - `children` (`ChildList?`): Convenience multi-child vertical column slot (at least one of `child` or `children` must be provided).
  - `title` (`DynamicString?`): Optional crisp card header title.
  - `subtitle` (`DynamicString?`): Optional secondary header caption.
  - `headerTrailing` (`Child?`): Optional badge or action in the top-right header slot.
  - `footer` (`Child?`): Optional footer slot separated by a subtle hairline.
  - `variant` (`enum: ['elevated', 'outlined', 'subtle', 'glass']`, default `'elevated'`)
  - `padding` (`enum: ['none', 'sm', 'md', 'lg']`, default `'md'`)
  - `action` (`Action?`): Makes the entire card interactive (hover lift + `scale: 0.99` press spring + keyboard Enter/Space).
  - `weight` (`number?`)

### 2.7 `Tabs` *(Basic Catalog Superset)*
Multi-view switcher with shared-layout sliding spring pill indicator.
- **Properties:**
  - `tabs` (`array`, `minItems: 1`, **required**): Items `{ title: DynamicString, child: Child, icon?: string, badge?: DynamicString }`.
  - `defaultIndex` (`number`, default `0`)
  - `selectedValue` (`DynamicString?`): Optional two-way bound active tab index/key.
  - `variant` (`enum: ['segmented', 'underline']`, default `'segmented'`)
  - `weight` (`number?`)
- **Motion:** Active indicator glides across tabs with `springTactile` (`layoutId`), crossfading tab panel content over `160ms`.

### 2.8 `Accordion` *(New Agentic Primitive)*
Progressive-disclosure collapsible sections to keep complex agent responses scannable.
- **Properties:**
  - `items` (`array`, `minItems: 1`, **required**): Items `{ id: string, title: DynamicString, subtitle?: DynamicString, child: Child, icon?: string, defaultOpen?: boolean }`.
  - `allowMultiple` (`boolean`, default `false`)
  - `variant` (`enum: ['grouped', 'separated', 'ghost']`, default `'grouped'`)
  - `weight` (`number?`)
- **Motion:** Chevron rotates `0deg -> 180deg` and panel height animates smoothly via `springFluid` (built on `@radix-ui/react-accordion`).

### 2.9 `Modal` *(Basic Catalog Superset — Adaptive Mobile Bottom Sheet)*
Overlay dialog triggered by a trigger child or controlled state.
- **Properties:**
  - `trigger` (`Child`, **required**): Trigger component (e.g., `Button`) that opens the overlay.
  - `content` (`Child`, **required**): Body component rendered inside the overlay.
  - `title` (`DynamicString?`): Accessible dialog header title.
  - `description` (`DynamicString?`): Accessible dialog subtitle.
  - `open` (`DynamicBoolean?`): Optional data-bound open state.
  - `size` (`enum: ['sm', 'md', 'lg', 'fullscreen']`, default `'md'`)
  - `weight` (`number?`)
- **Desktop vs. Mobile Behavior:**
  - Desktop (`>= 768px`): Centered frosted-glass modal (`backdrop-filter: blur(22px)`) with scale `0.96 -> 1.0` entrance.
  - Mobile (`< 768px`): **iOS Draggable Bottom Sheet** with top grabber pill, drag-down-to-dismiss velocity threshold, and `env(safe-area-inset-bottom)` clearance.

### 2.10 `Divider` *(Basic Catalog Superset)*
Optical `1px` hairline separator with optional centered label.
- **Properties:**
  - `axis` (`enum: ['horizontal', 'vertical']`, default `'horizontal'`)
  - `label` (`DynamicString?`): Optional centered section label (e.g., `"OR"`, `"Flight Leg 2"`).
  - `weight` (`number?`)

---

## 3. Category 2: Typography, Media & Identity (7 Components)

### 3.1 `Text` *(Basic Catalog Superset)*
Optical typography and sanitized Markdown prose renderer.
- **Properties:**
  - `text` (`DynamicString`, **required**): Supports sanitized CommonMark + GFM tables/strikethrough via `@a2ui/markdown-it`.
  - `variant` (`enum: ['hero', 'h1', 'h2', 'h3', 'subtitle', 'body', 'caption', 'overline', 'code']`, default `'body'`; strict superset of Basic Catalog's `['caption', 'body']`).
  - `tone` (`enum: ['primary', 'secondary', 'tertiary', 'accent', 'success', 'warning', 'critical']`, default `'primary'`)
  - `align` (`enum: ['start', 'center', 'end']`, default `'start'`)
  - `maxLines` (`number?`): Optional CSS `line-clamp` truncation.
  - `tabularNums` (`boolean`, default `false`)
  - `weight` (`number?`)

### 3.2 `Image` *(Basic Catalog Superset)*
Media image with shimmer loading skeleton, graceful fallback, and optional tap-to-zoom lightbox.
- **Properties:**
  - `url` (`DynamicString`, **required**): Validated via `sanitizeMediaUrl`.
  - `description` (`DynamicString?`): Alt text and optional lightbox caption.
  - `fit` (`enum: ['contain', 'cover', 'fill', 'none', 'scaleDown']`, default `'cover'`)
  - `variant` (`enum: ['icon', 'avatar', 'smallFeature', 'mediumFeature', 'largeFeature', 'header', 'rounded', 'wide']`, default `'mediumFeature'`)
  - `aspectRatio` (`enum: ['1:1', '4:3', '16:9', '21:9', 'auto']`, default `'auto'`)
  - `zoomable` (`boolean`, default `false`): Enables Apple Photos-style spring zoom overlay on click/tap.
  - `weight` (`number?`)

### 3.3 `Icon` *(Basic Catalog Superset)*
Crisp `1.75px`-stroke vector icon mapping all 58 Basic Catalog v1.0 icon names plus 25 agentic icons to `lucide-react` (plus custom `svgPath` support).
- **Properties:**
  - `name` (`DynamicString | { svgPath: DynamicString }`, **required**): Supports all 58 Basic Catalog icon identifiers (`accountCircle`, `calendarToday`, `check`, `flight`...) + agentic identifiers (`sparkles`, `brain`, `terminal`, `code`, `gitPullRequest`, `shieldCheck`, `flight`, `hotel`, `trendingUp`, `trendingDown`, `globe`, `fileText`, `copy`, `externalLink`, `clock`, `zap`, `sliders`, `layers`, `wallet`, `chartBar`, `alertTriangle`, `checkCircle`, `xCircle`, `compass`, `database`).
  - `size` (`enum: ['xs', 'sm', 'md', 'lg', 'xl']`, default `'md'` — `14, 16, 20, 24, 32px`)
  - `tone` (`enum: ['inherit', 'primary', 'secondary', 'accent', 'success', 'warning', 'critical']`, default `'inherit'`)
  - `weight` (`number?`)

### 3.4 `Avatar` *(New Agentic Primitive)*
User, AI agent, or brand identity badge with image, initials fallback, and live status dot.
- **Properties:**
  - `name` (`DynamicString`, **required**): Full name used for accessible label and 2-letter initials fallback.
  - `src` (`DynamicString?`): Avatar image URL.
  - `subtitle` (`DynamicString?`): When provided, renders an inline `[Avatar + Name + Subtitle]` lockup.
  - `size` (`enum: ['xs', 'sm', 'md', 'lg']`, default `'md'` — `24, 32, 40, 52px`)
  - `shape` (`enum: ['circle', 'rounded']`, default `'circle'`; `'rounded'` is ideal for brand/app icons)
  - `status` (`enum: ['online', 'busy', 'offline', 'thinking']?`)
  - `weight` (`number?`)

### 3.5 `StatusBadge` *(New Agentic Primitive)*
Compact semantic pill for flight statuses, PR states, risk levels, and live indicators.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `tone` (`enum: ['neutral', 'info', 'accent', 'success', 'warning', 'critical']`, default `'neutral'`)
  - `icon` (`string?`): Optional leading icon name.
  - `pulse` (`boolean`, default `false`): Renders a subtle breathing dot for active/live statuses (`"Live"`, `"Deploying"`, `"On Time"`).
  - `size` (`enum: ['sm', 'md']`, default `'md'`)
  - `weight` (`number?`)

### 3.6 `Video` *(Basic Catalog Superset)*
Rounded native video player with poster preview and safe URL sanitization.
- **Properties:**
  - `url` (`DynamicString`, **required**)
  - `posterUrl` (`DynamicString?`)
  - `title` (`DynamicString?`)
  - `autoPlayMuted` (`boolean`, default `false`)
  - `weight` (`number?`)

### 3.7 `AudioPlayer` *(Basic Catalog Superset)*
Apple Voice Memos / ChatGPT Voice-inspired compact audio player with animated play/pause button, scrubbable progress bar, playback speed pill (`1x / 1.5x / 2x`), and tabular timecode.
- **Properties:**
  - `url` (`DynamicString`, **required**)
  - `description` (`DynamicString?`): Track or voice summary title.
  - `subtitle` (`DynamicString?`): Speaker or duration subtitle.
  - `weight` (`number?`)

---

## 4. Category 3: Tactile Inputs & Controls (9 Components)

All input components bind `accessibilityRef` to the underlying interactive control and `validationErrorsRef` to an animated inline validation message container.

### 4.1 `Button` *(Basic Catalog Superset, **Checkable**)*
Tactile action button supporting both Basic Catalog `child` composition and concise `label` + `icon` props.
- **Properties:**
  - `action` (`Action`, **required**)
  - `child` (`Child?`): Child component ID (preserved for 100% Basic Catalog compatibility).
  - `label` (`DynamicString?`): Direct button label (eliminates extra `Text` node boilerplate for agents; either `child` or `label` is required).
  - `variant` (`enum: ['default', 'primary', 'secondary', 'tonal', 'borderless', 'ghost', 'danger']`, default `'default'`)
  - `size` (`enum: ['sm', 'md', 'lg']`, default `'md'`)
  - `icon` (`string?`): Leading icon name.
  - `trailingIcon` (`string?`): Trailing icon name.
  - `fullWidth` (`boolean`, default `false`)
  - `disabled` (`DynamicBoolean?`)
  - `@checks` (`CheckRule[]?`): When any check fails, disables submission and surfaces the check error tooltip/caption.
  - `weight` (`number?`)
- **Motion:** `whileTap={{ scale: 0.97 }}` via `springTactile`, plus brief spinner feedback on async action dispatch.

### 4.2 `TextField` *(Basic Catalog Superset, **Checkable**)*
Clean Apple/ChatGPT input field or auto-growing textarea with two-way `WritableBinding`.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `value` (`DynamicString`, **required**)
  - `placeholder` (`DynamicString?`)
  - `helperText` (`DynamicString?`)
  - `variant` (`enum: ['shortText', 'longText', 'number', 'obscured', 'email', 'search', 'url']`, default `'shortText'`)
  - `prefixIcon` (`string?`)
  - `clearable` (`boolean`, default `false`)
  - `disabled` (`DynamicBoolean?`)
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)
- **Motion:** Focus ring blooms smoothly; failing `@checks` triggers a subtle `4px` horizontal spring shake on blur/submit and slides in the validation message.

### 4.3 `CheckBox` *(Basic Catalog Superset, **Checkable**)*
Accessible checkbox with animated SVG checkmark stroke draw.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `value` (`DynamicBoolean`, **required**)
  - `description` (`DynamicString?`): Optional secondary helper text beneath label.
  - `disabled` (`DynamicBoolean?`)
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)

### 4.4 `Switch` *(New Agentic Primitive, **Checkable**)*
iOS-authentic pill toggle switch for instant settings, subscription toggles, and feature flags.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `value` (`DynamicBoolean`, **required**)
  - `description` (`DynamicString?`)
  - `disabled` (`DynamicBoolean?`)
  - `action` (`Action?`): Optional side-effect action fired after toggling.
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)
- **Motion:** Thumb glides with `springTactile` and subtle width stretch during press.

### 4.5 `SegmentedControl` *(New Agentic Primitive)*
Signature Apple/ChatGPT sliding-pill single-choice selector (`2..5` mutually exclusive options).
- **Properties:**
  - `value` (`DynamicString`, **required**): Bound selected option `value`.
  - `options` (`array`, `minItems: 2`, `maxItems: 6`, **required**): Items `{ label: DynamicString, value: string, icon?: string }`.
  - `label` (`DynamicString?`)
  - `fullWidth` (`boolean`, default `true`)
  - `action` (`Action?`): Optional event/function fired on change.
  - `weight` (`number?`)
- **Motion:** Raised white/obsidian thumb indicator slides smoothly between segments via Motion `layoutId`.

### 4.6 `ChoicePicker` *(Basic Catalog Superset, **Checkable**)*
Single or multi-select option group supporting chips, checkboxes, or rich radio cards, with optional search filtering.
- **Properties:**
  - `options` (`array`, **required**): Items `{ label: DynamicString, value: string, description?: DynamicString, icon?: string, badge?: DynamicString }`.
  - `value` (`DynamicStringList`, **required**)
  - `label` (`DynamicString?`)
  - `variant` (`enum: ['multipleSelection', 'mutuallyExclusive']`, default `'mutuallyExclusive'`)
  - `displayStyle` (`enum: ['checkbox', 'chips', 'cards']`, default `'chips'`)
  - `filterable` (`boolean`, default `false`)
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)

### 4.7 `Slider` *(Basic Catalog Superset, **Checkable**)*
Tactile range slider with filled active track, tabular numeric readout, and touch-friendly thumb.
- **Properties:**
  - `value` (`DynamicNumber`, **required**)
  - `max` (`number`, **required**)
  - `min` (`number`, default `0`)
  - `steps` (`number?`, integer step count)
  - `label` (`DynamicString?`)
  - `unit` (`DynamicString?`, e.g., `"%"`, `"USD"`, `"GB"`)
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)

### 4.8 `StepperInput` *(New Agentic Primitive, **Checkable**)*
Compact `- / +` numeric stepper for party size, passenger count, nights, or item quantities.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `value` (`DynamicNumber`, **required**)
  - `min` (`number`, default `0`)
  - `max` (`number`, default `99`)
  - `step` (`number`, default `1`)
  - `description` (`DynamicString?`, e.g., `"Ages 12+"`)
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)
- **Motion:** Value rolls vertically (`translateY`) like an Apple Watch / iOS odometer digit transition.

### 4.9 `DateTimeInput` *(Basic Catalog Superset, **Checkable**)*
Clean date, time, or date-time picker with formatted pill trigger and native mobile picker support.
- **Properties:**
  - `value` (`DynamicString`, **required** — ISO 8601 string)
  - `label` (`DynamicString?`)
  - `enableDate` (`boolean`, default `true`)
  - `enableTime` (`boolean`, default `false`)
  - `min` (`DynamicString?`)
  - `max` (`DynamicString?`)
  - `@checks` (`CheckRule[]?`)
  - `weight` (`number?`)

---

## 5. Category 4: Agentic Reasoning, Workflow & HITL (4 Components)

### 5.1 `ThoughtTrace` *(New Agentic Primitive)*
ChatGPT o3 / Deep Research-inspired collapsible reasoning summary block.
- **Properties:**
  - `summary` (`DynamicString`, **required** — e.g., `"Thought for 6s · Analyzed 4 flight carriers"`)
  - `status` (`enum: ['thinking', 'complete']`, default `'complete'`)
  - `durationSeconds` (`DynamicNumber?`)
  - `steps` (`array?`): Items `{ title: DynamicString, detail?: DynamicString }`.
  - `child` (`Child?`): Optional rich body slot inside the expanded trace.
  - `defaultExpanded` (`boolean`, default `false`)
  - `weight` (`number?`)
- **Visual & Motion:** While `status === 'thinking'`, displays a subtle swept metallic text shimmer across `summary`; expands smoothly with a vertical timeline guide line on click.

### 5.2 `StepTimeline` *(New Agentic Primitive)*
Structured multi-step agent execution, deployment, or itinerary tracker.
- **Properties:**
  - `steps` (`array`, `minItems: 1`, **required**):
    - `id` (`string`, **required**)
    - `title` (`DynamicString`, **required**)
    - `subtitle` (`DynamicString?`)
    - `status` (`enum: ['pending', 'active', 'completed', 'error', 'skipped']`, **required**)
    - `timestamp` (`DynamicString?`, e.g., `"1.2s"` or `"09:40 JST"`)
    - `icon` (`string?`)
    - `child` (`Child?`): Optional nested component rendered beneath the step (e.g., tool output snippet).
  - `title` (`DynamicString?`)
  - `weight` (`number?`)
- **Motion:** Active step displays a pulsing `--lumina-accent-agent` ring; completed steps morph into a spring checkmark; connector line fills progressively.

### 5.3 `ApprovalCard` *(New Agentic Primitive, **Checkable**)*
Human-in-the-Loop (HITL) authorization gate for financial transactions, bookings, emails, or production deployments.
- **Properties:**
  - `title` (`DynamicString`, **required** — e.g., `"Approve Production Rollout v2.14.2"`)
  - `description` (`DynamicString?`)
  - `riskLevel` (`enum: ['low', 'medium', 'high']`, default `'medium'`)
  - `state` (`DynamicString?`, values `'pending' | 'approved' | 'rejected'`, default `'pending'`): Supports instant reactive transition to a locked receipt state.
  - `details` (`Child?`): Optional slot for a `KeyValueList`, `DiffViewer`, or confirmation `CheckBox`/`TextField`.
  - `approveLabel` (`DynamicString`, default `'Approve'`)
  - `approveAction` (`Action`, **required**)
  - `rejectLabel` (`DynamicString`, default `'Decline'`)
  - `rejectAction` (`Action?`)
  - `@checks` (`CheckRule[]?`): Gates `approveAction` until required user checks (e.g., confirmation checkbox or reason input) pass.
  - `weight` (`number?`)
- **Visual & Motion:** Features subtle risk-tinted top accent border (`low`: blue, `medium`: amber, `high`: coral); upon approval/rejection, smoothly morphs via `springFluid` into a timestamped decision receipt.

### 5.4 `ProgressIndicator` *(New Agentic Primitive)*
Determinate or indeterminate linear/circular progress tracker for background tasks, uploads, and research synthesis.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `value` (`DynamicNumber?`, `0..100`; when omitted, renders indeterminate animated shimmer bar/spinner)
  - `sublabel` (`DynamicString?`, e.g., `"18 of 24 sources indexed"`)
  - `variant` (`enum: ['bar', 'ring', 'segmented']`, default `'bar'`)
  - `segments` (`number?`, used when `variant === 'segmented'`)
  - `tone` (`enum: ['accent', 'success', 'warning', 'critical']`, default `'accent'`)
  - `weight` (`number?`)

---

## 6. Category 5: Grounding, Knowledge & Artifacts (5 Components)

### 6.1 `SourceList` *(New Agentic Primitive)*
ChatGPT Search-style grounded citation chips or horizontal source preview cards.
- **Properties:**
  - `sources` (`array`, `minItems: 1`, **required**):
    - `id` (`string`, **required**)
    - `title` (`DynamicString`, **required**)
    - `url` (`DynamicString`, **required**)
    - `domain` (`DynamicString?`, auto-derived from `url` hostname if omitted)
    - `snippet` (`DynamicString?`)
    - `publishedAt` (`DynamicString?`)
    - `index` (`number?`, 1-based citation badge number)
  - `variant` (`enum: ['pills', 'cards', 'compactList']`, default `'cards'`)
  - `title` (`DynamicString?`, e.g., `"Sources (5)"`)
  - `weight` (`number?`)
- **Visual & Motion:** Renders crisp domain monogram/favicon badges, citation numbers, and opens sanitized external URLs (`rel="noopener noreferrer"`) with hover preview lift.

### 6.2 `CodeBlock` *(New Agentic Primitive)*
Syntax-highlighted code viewer with language header, line numbers, one-click Copy checkmark animation, and optional action button.
- **Properties:**
  - `code` (`DynamicString`, **required**)
  - `language` (`string`, default `'text'` — e.g., `'typescript'`, `'python'`, `'sql'`, `'json'`, `'bash'`, `'yaml'`)
  - `filename` (`DynamicString?`)
  - `showLineNumbers` (`boolean`, default `true`)
  - `highlightLines` (`number[]?`): 1-based line numbers highlighted with subtle accent bar.
  - `maxHeight` (`number?`, pixels, default `420`)
  - `actionLabel` (`DynamicString?`, e.g., `"Run Query"`)
  - `action` (`Action?`)
  - `weight` (`number?`)

### 6.3 `DiffViewer` *(New Agentic Primitive)*
Unified or split patch viewer for code edits, configuration changes, or drafted text revisions.
- **Properties:**
  - `before` (`DynamicString`, **required**)
  - `after` (`DynamicString`, **required**)
  - `filename` (`DynamicString?`)
  - `language` (`string`, default `'text'`)
  - `viewMode` (`enum: ['unified', 'split']`, default `'unified'`; auto-switches `'split'` to `'unified'` on `< 640px` mobile screens)
  - `acceptAction` (`Action?`)
  - `rejectAction` (`Action?`)
  - `weight` (`number?`)

### 6.4 `ArtifactCard` *(New Agentic Primitive)*
ChatGPT Canvas / Document deliverable card representing a generated report, memo, itinerary, or spec that expands into a focused reader sheet or triggers an action.
- **Properties:**
  - `title` (`DynamicString`, **required**)
  - `subtitle` (`DynamicString?`, e.g., `"Updated just now · 1,240 words"`)
  - `kind` (`enum: ['document', 'report', 'code', 'plan', 'itinerary', 'dataset']`, default `'document'`)
  - `version` (`DynamicString?`, e.g., `"v2"`)
  - `preview` (`DynamicString?`): Short Markdown/text excerpt shown on the card face.
  - `child` (`Child?`): Full artifact content rendered inside a slide-over Canvas Drawer (desktop) or fullscreen Sheet (mobile) when opened!
  - `action` (`Action?`): Optional external action dispatched on open or primary button click.
  - `weight` (`number?`)

### 6.5 `Callout` *(New Agentic Primitive)*
Tinted Apple/ChatGPT insight, tip, warning, or alert banner.
- **Properties:**
  - `body` (`DynamicString`, **required** — supports Markdown)
  - `title` (`DynamicString?`)
  - `tone` (`enum: ['neutral', 'info', 'tip', 'success', 'warning', 'critical']`, default `'info'`)
  - `icon` (`string?`)
  - `actionLabel` (`DynamicString?`)
  - `action` (`Action?`)
  - `weight` (`number?`)

---

## 7. Category 6: Data Synthesis & Conversational Flow (6 Components)

### 7.1 `StatMetric` *(New Agentic Primitive)*
Big-number KPI card with animated counter interpolation, semantic trend delta pill, and optional inline SVG sparkline.
- **Properties:**
  - `label` (`DynamicString`, **required**)
  - `value` (`DynamicString`, **required** — e.g., `"$142,850"` or `{ "@call": "formatCurrency", ... }`)
  - `delta` (`DynamicString?`, e.g., `"+14.2% YoY"`)
  - `trend` (`enum: ['up', 'down', 'flat']?`)
  - `trendSentiment` (`enum: ['positive', 'negative', 'neutral']?` — allows `"down"` latency to render green/`positive`!)
  - `caption` (`DynamicString?`)
  - `sparkline` (`DynamicValue?` — resolved `number[]` rendered as a smooth cubic-bezier area sparkline)
  - `weight` (`number?`)

### 7.2 `Chart` *(New Agentic Primitive)*
Agent-friendly, zero-Vega-boilerplate native SVG/interactive chart with animated draw and desktop hover / mobile touch-scrub inspection.
- **Properties:**
  - `type` (`enum: ['line', 'area', 'bar', 'stackedBar', 'donut']`, **required**)
  - `data` (`DynamicValue`, **required**): Resolved array of data objects `Array<Record<string, string | number>>` (either literal array or `{ "@path": "/metrics/quarterly" }`).
  - `xKey` (`string`, **required**): Field name for categories/timestamps (or slice label for `'donut'`).
  - `series` (`array`, `minItems: 1`, **required**):
    - `key` (`string`, **required**): Numeric field name in each `data` record.
    - `label` (`DynamicString`, **required**): Human-readable legend/tooltip name.
    - `color` (`enum: ['blue', 'indigo', 'emerald', 'amber', 'rose', 'cyan', 'slate']?`)
  - `title` (`DynamicString?`)
  - `subtitle` (`DynamicString?`)
  - `valuePrefix` (`string?`, e.g., `"$"`)
  - `valueSuffix` (`string?`, e.g., `"%"`, `"ms"`)
  - `height` (`number`, default `240`)
  - `showLegend` (`boolean`, default `true`)
  - `weight` (`number?`)
- **Visual & Motion:** SVG strokes animate via path-length reveal (`550ms`); hovering (desktop) or dragging a finger horizontally (mobile) snaps a magnetic vertical hairline across points and updates an Apple Stocks-style live readout header!

### 7.3 `DataTable` *(New Agentic Primitive)*
Clean, client-sortable, mobile-scrollable structured data grid.
- **Properties:**
  - `columns` (`array`, `minItems: 1`, **required**):
    - `key` (`string`, **required**)
    - `header` (`DynamicString`, **required**)
    - `align` (`enum: ['start', 'center', 'end']`, default `'start'`)
    - `format` (`enum: ['text', 'number', 'currency', 'percent', 'badge']`, default `'text'`)
    - `currency` (`string?`, default `'USD'`)
    - `sortable` (`boolean`, default `true`)
  - `rows` (`DynamicValue`, **required**): Resolved `Array<Record<string, unknown>>` (literal or `{ "@path": "/..." }`).
  - `rowKey` (`string`, default `'id'`)
  - `caption` (`DynamicString?`)
  - `maxRows` (`number?`): Enables clean `"Show all N rows"` expansion when exceeded.
  - `rowAction` (`Action?`): Dispatches action with clicked row merged into `context` / data binding when a row is selected.
  - `weight` (`number?`)

### 7.4 `KeyValueList` *(New Agentic Primitive)*
Apple Wallet / Receipt / Inspector-style aligned key-value summary list.
- **Properties:**
  - `items` (`array`, `minItems: 1`, **required**):
    - `label` (`DynamicString`, **required**)
    - `value` (`DynamicString`, **required**)
    - `subvalue` (`DynamicString?`)
    - `tone` (`enum: ['default', 'strong', 'accent', 'success', 'warning', 'critical']`, default `'default'`)
    - `copyable` (`boolean`, default `false`): Adds one-click copy icon next to confirmation codes, hashes, or IDs.
    - `mono` (`boolean`, default `false`)
  - `title` (`DynamicString?`)
  - `layout` (`enum: ['rows', 'grid']`, default `'rows'`)
  - `dividers` (`boolean`, default `true`)
  - `weight` (`number?`)

### 7.5 `ComparisonMatrix` *(New Agentic Primitive)*
Side-by-side option evaluator for flights, SaaS plans, hardware specs, or vendor quotes.
- **Properties:**
  - `criteria` (`array`, `minItems: 1`, **required**): Items `{ key: string, label: DynamicString }`.
  - `options` (`array`, `minItems: 2`, `maxItems: 5`, **required**):
    - `id` (`string`, **required**)
    - `title` (`DynamicString`, **required**)
    - `subtitle` (`DynamicString?`, e.g., `"$840 roundtrip"`)
    - `badge` (`DynamicString?`, e.g., `"Best Value"`)
    - `recommended` (`boolean`, default `false`)
    - `values` (`object`, **required** — map from `criteria.key` to `DynamicString`)
    - `actionLabel` (`DynamicString?`, e.g., `"Select Flight"`)
    - `action` (`Action?`)
  - `title` (`DynamicString?`)
  - `weight` (`number?`)
- **Responsive Mobile Behavior:** Renders a unified sticky-column comparison grid on desktop and automatically switches to swipeable snap-aligned option cards with inline criterion labels on `< 640px` mobile screens!

### 7.6 `FollowUpSuggestions` *(New Agentic Primitive)*
Conversational next-step prompt pills placed at the end of an agent surface.
- **Properties:**
  - `suggestions` (`array`, `minItems: 1`, `maxItems: 6`, **required**):
    - `label` (`DynamicString`, **required**)
    - `icon` (`string?`, default `'sparkles'` or `'arrowForward'`)
    - `action` (`Action`, **required**)
  - `title` (`DynamicString?`, e.g., `"Suggested next steps"`)
  - `layout` (`enum: ['wrap', 'scroll', 'stack']`, default `'wrap'`)
  - `weight` (`number?`)
- **Motion:** Pills stagger in (`40ms` interval) after the primary surface settles; clicking a pill highlights it and dispatches `action`.

### 7.7 `AnnotatedDiagram` *(Intelligent UI Visual Explanation Primitive)*
Interactive SVG schematic and hotspot callout Component for breaking down mechanical systems, anatomy, hardware, or step-by-step diagrams.
- **Properties:**
  - `title` (`DynamicString?`), `subtitle` (`DynamicString?`)
  - `preset` (`enum: ['bicycle-7speed', 'architecture', 'custom']`, default `'custom'`)
  - `value` (`DynamicString?`): Two-way bound active group or hotspot ID (`"all"`, `"frame"`, `"wheels"`, `"drivetrain"`, `"brakes"`, `"cockpit"`).
  - `groups` (`array?`): Filter pills `{ id: string, label: DynamicString }`.
  - `hotspots` (`array`, `minItems: 1`, **required**): `{ id: string, group?: string, x: number, y: number, label: DynamicString, badge?: DynamicString, detail: DynamicString }`.
  - `shapes` (`array?`): Custom declarative SVG primitives (`line`, `circle`, `rect`, `path`).
  - `activeStep` (`DynamicNumber?`): Optional numeric state (e.g., gear `1..7`) driving live mechanical animation.
  - `cadence` (`DynamicNumber?`): Optional RPM animation rate.
  - `weight` (`number?`)

### 7.8 `RouteMap` *(Intelligent UI Spatial Planning Primitive)*
Interactive cartographic route and landmark stop Component with category filtering, animated route polyline, pin selection, and adaptive overlay expansion.
- **Properties:**
  - `title` (`DynamicString?`), `subtitle` (`DynamicString?`)
  - `regionPreset` (`enum: ['sf-bay', 'pnw', 'auto']`, default `'auto'`)
  - `value` (`DynamicString?`): Two-way bound selected stop ID.
  - `categoryFilter` (`DynamicString?`): Optional active stop category filter (`"all"` by default).
  - `stops` (`array`, `minItems: 1`, **required**): `{ id: string, title: DynamicString, subtitle?: DynamicString, time?: DynamicString, category?: string, lat: number, lng: number, icon?: string, badge?: DynamicString, detourNote?: DynamicString }`.
  - `expandable` (`boolean`, default `true`): Opens full map inside `AdaptiveOverlay` (desktop dialog / mobile bottom sheet).
  - `height` (`number`, `180..520`, default `280`)
  - `weight` (`number?`)

### 7.9 `ProportionBar` *(Intelligent UI Quantitative Breakdown Primitive)*
Horizontal proportional multi-segment allocation bar with color-swatched tabular legend statistics and negative-offset callout support (used for investment contributions vs. growth and macroeconomic GDP breakdowns).
- **Properties:**
  - `title` (`DynamicString?`), `subtitle` (`DynamicString?`)
  - `variant` (`enum: ['split', 'stacked', 'inlineLabels']`, default `'split'`)
  - `segments` (`array`, `minItems: 1`, **required**): `{ id: string, label: DynamicString, value: DynamicNumber, formattedValue?: DynamicString, color?: ChartColorEnum }`.
  - `unitPrefix` (`string?`), `unitSuffix` (`string?`), `decimals` (`number?`)
  - `negativeNote` (`DynamicString?`): Contextual note displayed when any segment is negative (e.g., net imports in GDP).
  - `weight` (`number?`)

### 7.10 `ChecklistCard` *(Intelligent UI Interactive Task & Timeline Primitive)*
Tactile checkable step list with live `X of N` completion header, animated progress bar, optional time/category pills, strikethrough completion physics, and reset action.
- **Properties:**
  - `checks` (`CheckRule[]?`)
  - `title` (`DynamicString`, **required**), `subtitle` (`DynamicString?`)
  - `value` (`DynamicStringList`): Two-way bound list of completed item IDs.
  - `items` (`array`, `minItems: 1`, **required**): `{ id: string, title: DynamicString, detail?: DynamicString, time?: DynamicString, badge?: DynamicString }`.
  - `showProgress` (`boolean`, default `true`), `resettable` (`boolean`, default `true`)
  - `weight` (`number?`)

### 7.11 `QuizCard` *(Intelligent UI Knowledge Check & Multi-Question Quiz Primitive)*
Interactive single-question comprehension check or `< 1 of N >` multi-question quiz with lettered `A/B/C/D` badges, emerald/coral answer verification, inline explanation disclosure, hint toggle, and score summary.
- **Properties:**
  - `title` (`DynamicString?`), `subtitle` (`DynamicString?`)
  - `value` (`DynamicString?`): Optional two-way bound selected option ID for single-question checks.
  - `questions` (`array`, `minItems: 1`, **required**): `{ id: string, prompt: DynamicString, hint?: DynamicString, correctOptionId: string, explanation?: DynamicString, options: Array<{ id: string, label: DynamicString, explanation?: DynamicString }> }`.
  - `showScore` (`boolean`, default `true`)
  - `weight` (`number?`)

### 7.12 `SwatchPicker` *(Intelligent UI Color & Material Palette Primitive)*
Tactile circular or card color swatch selector with optical concentric rings, luminance-aware contrast checkmarks, and color name/hex labels.
- **Properties:**
  - `checks` (`CheckRule[]?`)
  - `label` (`DynamicString?`)
  - `value` (`DynamicString`): Two-way bound selected swatch value.
  - `swatches` (`array`, `minItems: 2`, **required**): `{ value: string, label: DynamicString, hex: string, subtitle?: DynamicString }`.
  - `variant` (`enum: ['circle', 'card']`, default `'circle'`), `size` (`enum: ['sm', 'md', 'lg']`, default `'md'`)
  - `weight` (`number?`)

### 7.13 `SplitLedger` *(Intelligent UI Itemized Expense & Clipboard Bill Splitter)*
Interactive multi-party itemized bill and expense splitter supporting clipboard paper or elevated card presentation, editable guest names, dynamic add/remove line items, per-item multi-guest assignment, `$ / %` tax and preset/slider tip controls, and largest-remainder cent-exact receipt allocation with clipboard export.
- **Properties:**
  - `eyebrow` (`DynamicString?`), `title` (`DynamicString`, **required**), `subtitle` (`DynamicString?`), `footerNote` (`DynamicString?`)
  - `variant` (`enum: ['clipboard', 'card']`, default `'clipboard'`)
  - `currency` (`string`, default `'USD'`)
  - `guests` (`array`, `minItems: 2`, `maxItems: 10`, **required**): `string[]` initial guest names.
  - `items` (`array`, `minItems: 1`, **required**): `{ id: string, name: string, price: number, sharedBy: number[] }`.
  - `taxAmount` (`DynamicNumber?`), `taxMode` (`enum: ['amount', 'percent']`, default `'amount'`)
  - `tipPercent` (`DynamicNumber?`), `tipPresets` (`number[]?`, default `[15, 18, 20, 25]`)
  - `defaultExpandedReceipt` (`boolean`, default `false`)
  - `weight` (`number?`)

### 7.14 `MicroApp` *(Intelligent UI Safe Playable & Generative Canvas Escape Hatch)*
Theme-synchronized interactive micro-application Component providing zero-script built-in engines (`retro-arcade` with playable Snake, Breakout, and Pong on a tactile 8-bit console; `drum-sequencer` 16-step WebAudio synthesizer) alongside a locked-down `sandbox="allow-scripts"` `srcDoc` escape hatch.
- **Properties:**
  - `title` (`DynamicString`, **required**), `subtitle` (`DynamicString?`), `badge` (`DynamicString?`)
  - `preset` (`enum: ['retro-arcade', 'drum-sequencer', 'customHtml']`, default `'retro-arcade'`)
  - `defaultGame` (`enum: ['snake', 'breakout', 'pong']`, default `'snake'`)
  - `html` (`string?`): Self-contained HTML/CSS/JS rendered inside an isolated `sandbox="allow-scripts"` iframe without `allow-same-origin` when `preset === 'customHtml'`.
  - `height` (`number?`, `220..760`)
  - `weight` (`number?`)

---

## 8. Renderer Functions Specification (24 Functions)

### 8.1 Standard A2UI v1.0 Basic Functions (14 — Reused from `@a2ui/web_core/v1_0`)
All 14 upstream Basic Catalog v1.0 functions are registered unmodified so every validation rule and string/number/currency/date formatter behaves identically to the reference specification:
`required`, `regex`, `length`, `numeric`, `email`, `formatString`, `formatNumber`, `formatCurrency`, `formatDate`, `pluralize`, `openUrl`, `and`, `or`, `not`.

### 8.2 Lumina Agentic & Reactive Math Functions (10)

| Function Name | `returnType` | `allowedCallers` | `requiresUserActivation` | Arguments (`args`) | Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `formatCompactNumber` | `"string"` | `"rendererOnly"` | `false` | `value: DynamicNumber` *(req)*, `decimals?: DynamicNumber` *(default `1`)* | Formats large numbers with `Intl.NumberFormat('en-US', { notation: 'compact' })` (`1420000` -> `"1.4M"`). |
| `formatPercent` | `"string"` | `"rendererOnly"` | `false` | `value: DynamicNumber` *(req, ratio `0.124`)*, `decimals?: DynamicNumber` *(default `1`)*, `signDisplay?: enum['auto','always','never']` | Formats ratios into crisp tabular percentage strings (`"+12.4%"`). |
| `formatRelativeTime` | `"string"` | `"rendererOnly"` | `false` | `value: DynamicString` *(req, ISO 8601)* | Formats timestamps relative to current time (`"just now"`, `"4m ago"`, `"in 2h"`). |
| `copyToClipboard` | `"void"` | `"rendererOnly"` | `true` | `text: DynamicString` *(req)*, `label?: DynamicString` | Writes `text` to `navigator.clipboard` and triggers a non-intrusive floating toast pill (`"Copied to clipboard"`). |
| `shareContent` | `"boolean"` | `"rendererOnly"` | `true` | `title: DynamicString` *(req)*, `text?: DynamicString`, `url?: DynamicString` | Invokes `navigator.share` on mobile browsers/WebViews; falls back cleanly to `navigator.clipboard` on desktop. |
| `setValue` | `"void"` | `"rendererOnly"` | `false` | `path: string` *(req, JSON pointer)*, `value: DynamicValue` *(req)* | Updates the surface's local `DataModel` at `path` immediately without an agent roundtrip (e.g., reset button or preset chip). |
| `computeMath` | `"number"` | `"rendererOnly"` | `false` | `op: enum['add','sub','mul','div','round','ceil','floor','clamp','abs','percentOf','sum']` *(req)*, `a: DynamicNumber` *(req)*, `b?: DynamicNumber`, `c?: DynamicNumber`, `d?: DynamicNumber`, `decimals?: DynamicNumber` | Evaluates safe client-side arithmetic for live quantity scaling, totals, and ratios at 0ms RTT. |
| `compoundGrowth` | `"number"` | `"rendererOnly"` | `false` | `monthly: DynamicNumber` *(req)*, `years: DynamicNumber` *(req)*, `annualRate: DynamicNumber` *(req)*, `initial?: DynamicNumber` *(default `0`)*, `metric?: enum['total','contributions','growth']` *(default `'total'`)* | Computes exact monthly-compounded annuity & principal projections (`Math.expm1` / `Math.log1p` precision). |
| `selectByValue` | `"any"` | `"rendererOnly"` | `false` | `value: DynamicValue` *(req)*, `cases?: object`, `fallback?: DynamicValue`, `whenNegative?: DynamicValue`, `whenNonNegative?: DynamicValue` | Declarative client-side conditional/lookup expression for switching copy, data arrays, or warnings based on reactive state. |
| `runSimulation` | `"void"` | `"rendererOnly"` | `false` | `mode: enum['cltDraw','cltReset','montyPick','montyResolve','montySim','montyReset']` *(req)*, `path: string` *(req)*, `count?: DynamicNumber`, `sampleSize?: DynamicNumber`, `distribution?: DynamicString`, `door?: DynamicNumber`, `strategy?: DynamicString` | Executes deterministic-safe client-side Monte Carlo and probability state updates directly in the Surface `Data Model`. |

---

## 9. Catalog Prompt `instructions` Specification

The `instructions` markdown field embedded in `catalog.json` (and injected automatically into LLM system prompts by `@a2ui/agent`'s `A2uiGenerator`) MUST follow five conciseness and accuracy rules:

1. **Prefer High-Order Semantic Components Over Nested Primitives:** Instruct the LLM to use `KeyValueList` for summaries/receipts, `StatMetric` + `Grid` for KPIs, `ComparisonMatrix` for side-by-side options, `StepTimeline` for workflows, `ApprovalCard` for confirmations, `SourceList` for citations, and `Chart` / `DataTable` for quantitative data—never emulating them with deeply nested `Row`/`Column`/`Text` nodes.
2. **Concise Button Authoring:** Prefer `Button` with `label` + optional `icon` over creating a separate child `Text` component unless rich composite button content is required.
3. **Reactive Client Math & Formatting:** Use `@path` bindings paired with `formatCurrency`, `formatCompactNumber`, `formatPercent`, and `formatString("${/path}")` so interactive `Slider`, `StepperInput`, and `Switch` controls update displayed totals in real time on the client.
4. **Human-in-the-Loop Safety:** Wrap irreversible or financial actions inside `ApprovalCard` with appropriate `riskLevel` and attach `@checks` when user acknowledgment is required.
5. **Conversational Continuity:** End exploratory or analytical surfaces with `FollowUpSuggestions` (`2..4` contextual prompt chips) so users on mobile and desktop can continue the workflow with a single tap.

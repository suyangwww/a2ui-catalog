# A2UI Lumina Playbook — A Practical Guide for People & Agents

Welcome to the **A2UI Lumina Playbook**. Whether you are a product manager, a designer, an engineer, or configuring an AI agent, this guide explains **how Lumina works** and **how to pick the right component for every job** in plain English.

---

## 1. The Big Idea in 60 Seconds

When an AI agent only replies with plain text, people have to read walls of paragraphs and type long follow-up replies. On the other hand, letting an AI generate raw HTML or code on the fly is slow, inconsistent, and risky.

**A2UI v1.0** solves this with a simple agreement between the **Agent** and the **App**:

1. **The Catalog is the Menu:** Lumina gives the agent a trusted menu of **41 ready-made UI building blocks** (cards, charts, tables, toggles, approval gates, and side-panel documents).
2. **The Agent Sends Plain Data, Never Code:** The agent sends a small JSON message listing which components to show, what properties to pass them, and a shared **Data Model** (a simple dictionary of current values, like `{ "seats": 5, "verified": false }`).
3. **One Payload Works Everywhere:** You do not write separate payloads for Light Mode, Dark Mode, Desktop, iPad, or iPhone. Every Lumina component shares the same clean look and automatically adapts its layout to fit the screen it is on.

---

## 2. Five Everyday Recipes (When to Use What)

As a rule of thumb, **start with the user's task**, not the component list. Almost every good agent screen is built from one of these five recipes:

### Recipe 1: Show What the Agent Is Doing
> **Goal:** Build trust when the agent takes more than a second or two to search, plan, or run tools.

- **`ThoughtTrace`** — Put this at the top of a reply to summarize how the agent reasoned. Keep `defaultExpanded: false` so the screen stays calm unless someone wants to inspect the steps.
- **`StepTimeline`** — Use when an agent is running a sequence of concrete actions (for example: *1. Checked inventory -> 2. Reserved flight -> 3. Waiting for confirmation*).
- **`ProgressIndicator`** — Use `variant: "bar"` or `"ring"` for percentage progress, `"segmented"` for multi-stage rollouts, or omit `value` when duration is unknown.

### Recipe 2: Back Up Answers with Sources & Clear Numbers
> **Goal:** Let people verify facts at a glance instead of hunting through paragraphs.

- **`SourceList`** — Always attach cited web pages, filings, or internal docs (`variant: "cards"` for 2–4 key sources, `"pills"` for compact inline references).
- **`Grid` + `StatMetric`** — Pull the 2 to 4 most important numbers out of your text and place them in a `Grid` (`minItemWidth: 210`). Add `sparkline` for quick history and `trendSentiment` so the app knows whether "down" is good (like lower error rates) or bad (like lower revenue).
- **`Chart`** — Use `"area"` or `"line"` for trends over time, `"bar"` or `"stackedBar"` for category comparisons, and `"donut"` for shares of a total. Users can hover with a mouse on Desktop or drag a finger across the chart on iPad and iPhone.
- **`DataTable`** — Use for 4+ structured rows where people may want to sort columns (`sortable: true`) or scan formatted currency, percentages, and status badges.
- **`Callout`** — Highlight a single takeaway, warning, or blocker (`tone: "info" | "tip" | "warning" | "critical"`).

### Recipe 3: Let People Tap Instead of Type
> **Goal:** Turn back-and-forth typing into quick, mistake-free controls bound directly to the Data Model.

- **`SegmentedControl`** — Best for 2 to 4 mutually exclusive modes (for example: *Economy / Business / First*).
- **`ChoicePicker`** — Best for selecting one or many tags from 4+ options (`displayStyle: "chips"` for quick pills, `"cards"` when each option needs a short description, `filterable: true` for long lists).
- **`StepperInput`** — Best for small whole numbers like headcount, nights, or seats (`+` / `-` buttons).
- **`Slider`** — Best for budgets, percentages, or thresholds where seeing live numbers update as you drag helps you decide.
- **`Switch` & `CheckBox`** — Use `Switch` for instant on/off preferences; use `CheckBox` when someone is explicitly agreeing to or verifying a statement.
- **`TextField` & `DateTimeInput`** — Use for short text notes, emails, or picking a calendar date/time.
- **`FollowUpSuggestions`** — Place 2 to 4 tap-to-send prompt pills at the bottom of a turn so users always have an obvious next step.

### Recipe 4: Put a Human Safety Gate in Front of Real Actions
> **Goal:** Never let an agent spend money, delete data, message customers, or deploy code without clear human sign-off.

- **Show the exact change first:** Use **`KeyValueList`** for bookings/transfers (who, how much, confirmation details) or **`DiffViewer`** / **`CodeBlock`** for code and configuration changes.
- **Gate execution with `ApprovalCard`:** Set `riskLevel: "high"` (red) or `"medium"` (amber) so the stakes are unmistakable.
- **Lock risky buttons with validation checks (`@checks`):** Pair a `CheckBox` (bound to e.g. `/confirmed`) with `@checks` on `ApprovalCard` or `Button`. The approve button stays disabled right in the browser until the person checks the box — no server round-trip needed.

### Recipe 5: Keep the Chat Clean — Put Long Content in a Side Panel
> **Goal:** Don't dump a 200-line report or itinerary directly into the chat stream.

- **`ArtifactCard`** — Shows a clean summary card in chat (`title`, `kind`, `version`, `preview`) with an **Open** button. When clicked, its `child` content opens in a **split side panel on Desktop**, a ** spacious sheet on iPad**, or a **slide-up bottom sheet on iPhone**.
- **`Modal`** — Use for secondary details (like security terms or settings) triggered by a button without leaving the current task.

---

## 3. Quick Decision Cheat Sheet (All 41 Components)

| What You Need to Do | Pick This Component | Key Properties to Set |
| :--- | :--- | :--- |
| **Place items side by side** | `Row` | `children`, `gap`, `align`, `justify`, `wrap` |
| **Stack items top to bottom** | `Column` | `children`, `gap`, `align` |
| **Responsive multi-column cards** | `Grid` | `children`, `columns`, `minItemWidth`, `gap` |
| **Vertical or templated repeating rows** | `List` | `children`, `dividers`, `direction` |
| **Swipeable horizontal card rail** | `Carousel` | `children`, `title`, `itemWidth` |
| **Group related content in a box** | `Card` | `title`, `subtitle`, `variant`, `children`, `footer` |
| **Switch between views in one card** | `Tabs` | `tabs` (`label`, `value`, `child`), `variant` |
| **Collapsible Q&A or detail sections** | `Accordion` | `items` (`title`, `child`), `allowMultiple` |
| **Popup dialog / mobile bottom sheet** | `Modal` | `trigger`, `content`, `title`, `size` |
| **Visual separator line** | `Divider` | `axis`, `label` |
| **Headings, body copy, or Markdown** | `Text` | `text`, `variant`, `tone`, `tabularNums` |
| **Photos or diagrams with tap-to-zoom** | `Image` | `url`, `description`, `aspectRatio`, `zoomable` |
| **Clean symbol from 83 built-in icons** | `Icon` | `name`, `size`, `tone` |
| **Person or agent profile badge** | `Avatar` | `name`, `subtitle`, `src`, `status` |
| **Colored status pill** | `StatusBadge` | `label`, `tone`, `pulse`, `icon` |
| **Inline video clip** | `Video` | `url`, `posterUrl`, `title` |
| **Voice note or audio summary** | `AudioPlayer` | `url`, `description`, `subtitle` |
| **Trigger an agent or client action** | `Button` | `label`, `variant`, `icon`, `action`, `@checks` |
| **Single-line or multi-line text box** | `TextField` | `label`, `value` (`@path`), `placeholder`, `clearable` |
| **Tick box for agreement / selection** | `CheckBox` | `label`, `value` (`@path`), `description` |
| **Instant on/off toggle** | `Switch` | `label`, `value` (`@path`), `description` |
| **2–4 option sliding pill switch** | `SegmentedControl` | `options`, `value` (`@path`), `label` |
| **Single or multi-select chips/cards** | `ChoicePicker` | `options`, `value` (`@path`), `variant`, `displayStyle` |
| **Drag-to-adjust number range** | `Slider` | `label`, `min`, `max`, `value` (`@path`), `unit` |
| **Plus / minus counter** | `StepperInput` | `label`, `value` (`@path`), `min`, `max`, `step` |
| **Date or time picker** | `DateTimeInput` | `label`, `value` (`@path`), `enableDate`, `enableTime` |
| **Collapsible agent reasoning summary** | `ThoughtTrace` | `summary`, `status`, `durationSeconds`, `steps` |
| **Step-by-step workflow tracker** | `StepTimeline` | `title`, `steps` (`title`, `status`, `timestamp`) |
| **Approve / reject confirmation gate** | `ApprovalCard` | `title`, `riskLevel`, `approveAction`, `rejectAction`, `@checks` |
| **Bar, ring, or stage progress meter** | `ProgressIndicator` | `label`, `value`, `variant`, `segments`, `tone` |
| **Grounded citations & links** | `SourceList` | `title`, `variant`, `sources` (`title`, `url`, `domain`) |
| **Syntax-highlighted code snippet** | `CodeBlock` | `code`, `language`, `filename`, `highlightLines` |
| **Before / after text or config diff** | `DiffViewer` | `before`, `after`, `filename`, `viewMode` |
| **Expandable side-panel deliverable** | `ArtifactCard` | `title`, `kind`, `version`, `preview`, `child` |
| **Highlighted note, tip, or alert** | `Callout` | `title`, `body`, `tone`, `actionLabel`, `action` |
| **Big KPI number with trend & sparkline** | `StatMetric` | `label`, `value`, `delta`, `trend`, `trendSentiment`, `sparkline` |
| **Interactive area, line, bar, or donut** | `Chart` | `type`, `data`, `xKey`, `series`, `title` |
| **Sortable formatted table** | `DataTable` | `columns` (`key`, `header`, `format`, `sortable`), `rows` |
| **Clean label-and-value receipt rows** | `KeyValueList` | `title`, `items` (`label`, `value`, `copyable`) |
| **Side-by-side option comparison** | `ComparisonMatrix` | `title`, `criteria`, `options` (`recommended`, `action`) |
| **Suggested next-step prompt pills** | `FollowUpSuggestions` | `title`, `suggestions` (`label`, `action`) |

---

## 4. How Light/Dark Mode & Different Screens Work Automatically

One of Lumina's biggest advantages for teams is that **agents never hardcode colors or screen widths**:

- **Light & Dark Mode:** Instead of raw hex colors, components use semantic tones (`"primary"`, `"secondary"`, `"success"`, `"warning"`, `"critical"`). In **Light Mode**, surfaces render on crisp warm white with subtle borders; in **Dark Mode**, surfaces shift automatically to deep high-contrast charcoal with adjusted badge and chart contrast.
- **Desktop, iPad, and iPhone Adaptation:** Every component keeps the **exact same visual identity, typography, icons, and live state**, while automatically adjusting its layout to fit the device:
  - **`Grid`:** Shows 3 columns on Desktop -> 2 columns on iPad -> 1 full-width column on iPhone.
  - **`ComparisonMatrix`:** Shows a multi-column comparison table on Desktop & iPad -> turns into horizontally swipeable cards on iPhone.
  - **`DiffViewer`:** Shows side-by-side `before` and `after` columns on Desktop & iPad -> switches to a single-column unified diff on iPhone with zero sideways scrolling.
  - **`ArtifactCard` & `Modal`:** Open as a split side panel or centered dialog on Desktop & iPad -> slide up as a touch-friendly bottom sheet with a drag handle on iPhone.
  - **`ApprovalCard` & Inputs:** Enforce comfortable 44-pixel touch targets and stack action buttons full-width on iPhone so thumbs never miss.

---

## 5. Three Rules for Prompting or Building Agents with Lumina

1. **Stream Incrementally so Screens Feel Fast:**
   Send `createSurface` first with the outer layout and a `ThoughtTrace` (`status: "thinking"`). Stream additional cards with `updateComponents` as tool results arrive, and push live number updates with `updateDataModel`.
2. **Bind Inputs to Data Paths (`@path`) Instead of Extra Turns:**
   When you bind a `Slider`, `StepperInput`, or `SegmentedControl` to `{ "@path": "/budget" }` and display `{ "@call": "formatCurrency", "args": { "value": { "@path": "/budget" } } }` inside a `StatMetric`, the user can play with numbers instantaneously in the browser and only send one final `action` when ready.
3. **Keep One Primary Call-to-Action per Screen:**
   Avoid cluttering a turn with five competing primary buttons. Use subtle or secondary variants for optional actions, and reserve `variant: "primary"` (or a single `ApprovalCard`) for the main decision on screen.

import React from 'react';
import { MessageProcessor, type SurfaceModel } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import { processLuminaMessages } from '@a2ui-catalog/core';
import { LuminaProvider, LuminaSurface, luminaReactCatalog } from '@a2ui-catalog/react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  Layers,
  ListChecks,
  Monitor,
  Moon,
  Play,
  Smartphone,
  Sparkles,
  Sun,
  Tablet,
  Terminal,
} from 'lucide-react';
import { EXPLORER_EXAMPLES, type ExplorerExample } from './examples';
import { CATALOG_GROUPS, CATALOG_REFERENCE, type ComponentReferenceEntry } from './catalog-reference';
import './App.css';

interface ActionLogEntry {
  id: number;
  time: string;
  action: unknown;
}

type ExplorerMode = 'showcases' | 'components' | 'playbook';

function initialModeFromUrl(): ExplorerMode {
  if (typeof window === 'undefined') return 'showcases';
  const m = new URLSearchParams(window.location.search).get('mode');
  if (m === 'components' || m === 'playbook') return m;
  return 'showcases';
}

const PLAYBOOK_RECIPES = [
  {
    step: 'Recipe 1',
    title: 'Show What the Agent Is Doing',
    goal: 'Build trust whenever an agent takes more than a second to search, plan, or run tools.',
    components: ['ThoughtTrace', 'StepTimeline', 'ProgressIndicator'],
    guidance:
      'Put ThoughtTrace at the top of complex replies (defaultExpanded: false keeps the screen calm). Add StepTimeline for ordered tool steps and ProgressIndicator for percentage or multi-stage rollouts.',
  },
  {
    step: 'Recipe 2',
    title: 'Back Up Answers with Sources & Clear Numbers',
    goal: 'Let people verify facts at a glance instead of hunting through long paragraphs.',
    components: ['SourceList', 'Grid', 'StatMetric', 'Chart', 'DataTable', 'Callout'],
    guidance:
      'Attach cited pages with SourceList, pull top 2–4 numbers into a Grid of StatMetric cards, plot trends in Chart, and use sortable DataTable for structured comparisons.',
  },
  {
    step: 'Recipe 3',
    title: 'Let People Tap Instead of Type',
    goal: 'Turn back-and-forth typing into quick, mistake-free controls bound to the Data Model.',
    components: ['SegmentedControl', 'ChoicePicker', 'StepperInput', 'Slider', 'Switch', 'FollowUpSuggestions'],
    guidance:
      'Bind controls to Data Model paths (like /seats or /budget) so totals update right away in the browser. Add FollowUpSuggestions at the bottom so the next step is always one tap away.',
  },
  {
    step: 'Recipe 4',
    title: 'Put a Human Safety Gate in Front of Real Actions',
    goal: 'Never spend money, send external messages, or deploy changes without clear sign-off.',
    components: ['DiffViewer', 'KeyValueList', 'CheckBox', 'ApprovalCard'],
    guidance:
      'Preview the exact change first with KeyValueList or DiffViewer, then gate execution with ApprovalCard and @checks so the approve button stays locked until confirmed.',
  },
  {
    step: 'Recipe 5',
    title: 'Keep Chat Clean — Put Long Docs on the Side',
    goal: 'Avoid dumping a 200-line memo or itinerary straight into the conversation thread.',
    components: ['ArtifactCard', 'Modal'],
    guidance:
      'Wrap long reports, plans, or schedules in ArtifactCard. Clicking Open expands a side panel on Desktop, a centered sheet on iPad, or a slide-up bottom sheet on iPhone.',
  },
];

export function App() {
  const [mode, setMode] = React.useState<ExplorerMode>(initialModeFromUrl);
  const [selectedId, setSelectedId] = React.useState(EXPLORER_EXAMPLES[0].id);
  const [selectedCompName, setSelectedCompName] = React.useState(CATALOG_REFERENCE[0].name);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [inspectorTab, setInspectorTab] = React.useState<'props' | 'json' | 'data' | 'actions'>(() =>
    initialModeFromUrl() === 'components' ? 'props' : 'json',
  );
  const [jsonText, setJsonText] = React.useState(() =>
    JSON.stringify(EXPLORER_EXAMPLES[0].messages, null, 2),
  );
  const [jsonError, setJsonError] = React.useState<string | null>(null);
  const [streaming, setStreaming] = React.useState(false);
  const [actionLogs, setActionLogs] = React.useState<ActionLogEntry[]>([]);
  const [dataSnapshot, setDataSnapshot] = React.useState<Record<string, unknown>>({});
  const [surfaces, setSurfaces] = React.useState<SurfaceModel<ReactCatalogComponent>[]>([]);
  const processorRef = React.useRef<MessageProcessor<ReactCatalogComponent> | null>(null);
  const activeNavRef = React.useRef<HTMLButtonElement | null>(null);

  const selectedExample: ExplorerExample =
    EXPLORER_EXAMPLES.find((e) => e.id === selectedId) ?? EXPLORER_EXAMPLES[0];

  const selectedComponent: ComponentReferenceEntry =
    CATALOG_REFERENCE.find((c) => c.name === selectedCompName) ?? CATALOG_REFERENCE[0];

  const activeMessages =
    mode === 'components' ? selectedComponent.messages : selectedExample.messages;

  const loadMessages = React.useCallback((messages: Record<string, unknown>[], simulateStream = false) => {
    setJsonError(null);
    const proc = new MessageProcessor<ReactCatalogComponent>([luminaReactCatalog], (action) => {
      setActionLogs((prev) => [
        { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), action },
        ...prev.slice(0, 29),
      ]);
    });
    processorRef.current = proc;

    const refresh = () => {
      const list = Array.from(proc.model.surfacesMap.values());
      setSurfaces(list);
      const dm: Record<string, unknown> = {};
      for (const s of list) {
        dm[s.id] = s.dataModel.get('/');
      }
      setDataSnapshot(dm);
    };

    if (!simulateStream) {
      try {
        processLuminaMessages(proc, messages);
        refresh();
      } catch (err) {
        setJsonError(err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const first = messages[0] as {
      createSurface?: {
        surfaceId: string;
        catalogId: string;
        components?: Array<Record<string, unknown>>;
        dataModel?: Record<string, unknown>;
      };
    };
    const cs = first?.createSurface;
    if (!cs || !Array.isArray(cs.components) || cs.components.length <= 2) {
      processLuminaMessages(proc, messages);
      refresh();
      return;
    }

    setStreaming(true);
    const allComps = cs.components;
    const rootComp = allComps.find((c) => c.id === 'root') ?? allComps[0];
    const others = allComps.filter((c) => c !== rootComp);

    processLuminaMessages(proc, [
      {
        version: '1.0',
        createSurface: {
          surfaceId: cs.surfaceId,
          catalogId: cs.catalogId,
          dataModel: cs.dataModel,
          components: [rootComp, ...others.slice(0, 1)],
        },
      },
    ]);
    refresh();

    let cursor = 1;
    const timer = setInterval(() => {
      if (cursor >= others.length) {
        clearInterval(timer);
        setStreaming(false);
        return;
      }
      const batch = others.slice(cursor, cursor + 2);
      cursor += 2;
      try {
        processLuminaMessages(proc, [
          {
            version: '1.0',
            updateComponents: {
              surfaceId: cs.surfaceId,
              components: batch,
            },
          },
        ]);
        refresh();
      } catch {
        clearInterval(timer);
        setStreaming(false);
      }
    }, 140);
  }, []);

  React.useEffect(() => {
    if (mode === 'playbook') return;
    setJsonText(JSON.stringify(activeMessages, null, 2));
    loadMessages(activeMessages, false);
  }, [mode, activeMessages, loadMessages]);

  React.useEffect(() => {
    activeNavRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedCompName, mode]);

  React.useEffect(() => {
    if (inspectorTab !== 'data') return;
    const id = setInterval(() => {
      const proc = processorRef.current;
      if (!proc) return;
      const dm: Record<string, unknown> = {};
      for (const s of proc.model.surfacesMap.values()) {
        dm[s.id] = s.dataModel.get('/');
      }
      setDataSnapshot(dm);
    }, 300);
    return () => clearInterval(id);
  }, [inspectorTab]);

  const switchMode = (nextMode: ExplorerMode) => {
    setMode(nextMode);
    if (nextMode === 'components') {
      setInspectorTab('props');
    } else if (nextMode === 'showcases' && inspectorTab === 'props') {
      setInspectorTab('json');
    }
  };

  const stepComponent = (delta: number) => {
    const idx = CATALOG_REFERENCE.findIndex((c) => c.name === selectedCompName);
    const nextIdx = (idx + delta + CATALOG_REFERENCE.length) % CATALOG_REFERENCE.length;
    setSelectedCompName(CATALOG_REFERENCE[nextIdx].name);
  };

  const applyEditedJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      loadMessages(arr, false);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : String(err));
    }
  };

  const deviceLabel =
    device === 'desktop' ? 'Desktop Browser' : device === 'tablet' ? 'iPad Surface' : 'iPhone Surface';

  return (
    <div className="exp-shell" data-lumina-theme={theme}>
      <header className="exp-topbar">
        <div className="exp-brand">
          <span className="exp-brand-mark">
            <Sparkles size={16} />
          </span>
          <div>
            <div className="exp-brand-title">A2UI Lumina Explorer</div>
            <div className="exp-brand-sub">v1.0 · 41 Components · Light/Dark · Desktop, iPad & iPhone</div>
          </div>
        </div>

        <div className="exp-mode-tabs" role="tablist" aria-label="Explorer sections">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'showcases'}
            className={`exp-mode-tab ${mode === 'showcases' ? 'is-active' : ''}`}
            onClick={() => switchMode('showcases')}
          >
            <Layers size={14} />
            <span>Showcases</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'components'}
            className={`exp-mode-tab ${mode === 'components' ? 'is-active' : ''}`}
            onClick={() => switchMode('components')}
          >
            <ListChecks size={14} />
            <span>All 41 Components</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'playbook'}
            className={`exp-mode-tab ${mode === 'playbook' ? 'is-active' : ''}`}
            onClick={() => switchMode('playbook')}
          >
            <BookOpen size={14} />
            <span>Playbook</span>
          </button>
        </div>

        <div className="exp-toolbar">
          <div className="exp-seg-group" role="group" aria-label="Viewport preview">
            <button
              type="button"
              className={`exp-tool-btn ${device === 'desktop' ? 'is-active' : ''}`}
              onClick={() => setDevice('desktop')}
              title="Desktop Viewport"
            >
              <Monitor size={15} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              className={`exp-tool-btn ${device === 'tablet' ? 'is-active' : ''}`}
              onClick={() => setDevice('tablet')}
              title="iPad Viewport"
            >
              <Tablet size={15} />
              <span>iPad</span>
            </button>
            <button
              type="button"
              className={`exp-tool-btn ${device === 'mobile' ? 'is-active' : ''}`}
              onClick={() => setDevice('mobile')}
              title="iPhone Viewport"
            >
              <Smartphone size={15} />
              <span>iPhone</span>
            </button>
          </div>

          {mode !== 'playbook' && (
            <button
              type="button"
              className="exp-stream-btn"
              disabled={streaming}
              onClick={() => loadMessages(activeMessages, true)}
            >
              <Play size={14} />
              <span>{streaming ? 'Streaming...' : 'Simulate Stream'}</span>
            </button>
          )}

          <button
            type="button"
            className="exp-theme-btn"
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      {mode === 'playbook' ? (
        <main className="exp-playbook-page">
          <div className="exp-playbook-inner">
            <div className="exp-playbook-hero">
              <span className="exp-comp-counter">Practical Playbook · People & AI Agents</span>
              <h1 className="exp-playbook-title">How to Build Clear Agent Screens with Lumina</h1>
              <p className="exp-playbook-lead">
                Agents never send raw HTML or CSS. Instead, they pick from 41 ready-made building blocks and pass simple properties plus a shared Data Model. Every screen automatically works in Light and Dark mode across Desktop, iPad, and iPhone.
              </p>
            </div>

            <div className="exp-playbook-grid">
              {PLAYBOOK_RECIPES.map((r) => (
                <section key={r.step} className="exp-recipe-card">
                  <div className="exp-recipe-top">
                    <span className="exp-recipe-step">{r.step}</span>
                    <div className="exp-tags">
                      {r.components.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className="exp-tag exp-tag-clickable"
                          onClick={() => {
                            setSelectedCompName(c);
                            switchMode('components');
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h2 className="exp-recipe-title">{r.title}</h2>
                  <p className="exp-recipe-goal">{r.goal}</p>
                  <p className="exp-recipe-body">{r.guidance}</p>
                </section>
              ))}
            </div>

            <section className="exp-adapt-banner">
              <h2 className="exp-recipe-title">One JSON Payload — Automatic Theme & Device Adaptation</h2>
              <div className="exp-adapt-cols">
                <div className="exp-adapt-item">
                  <strong>Light & Dark Mode</strong>
                  <span>Semantic tones (primary, success, warning, critical) adjust surface, border, and badge contrast automatically.</span>
                </div>
                <div className="exp-adapt-item">
                  <strong>Desktop & iPad</strong>
                  <span>Multi-column Grids (3 cols on Desktop, 2 cols on iPad), side-by-side DiffViewer, full ComparisonMatrix tables, and split side panels.</span>
                </div>
                <div className="exp-adapt-item">
                  <strong>iPhone Mobile</strong>
                  <span>Single-column stacked Grids, swipeable ComparisonMatrix cards, unified zero-overflow DiffViewer, 44px touch targets, and slide-up bottom sheets.</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : (
        <div className={`exp-workspace ${mode === 'components' ? 'is-components-mode' : ''}`}>
          <aside className="exp-sidebar">
            {mode === 'showcases' ? (
              <>
                <div className="exp-sidebar-heading">Catalog Showcases</div>
                <nav className="exp-nav">
                  {EXPLORER_EXAMPLES.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      className={`exp-nav-item ${ex.id === selectedId ? 'is-active' : ''}`}
                      onClick={() => setSelectedId(ex.id)}
                    >
                      <span className="exp-nav-cat">{ex.category}</span>
                      <span className="exp-nav-title">{ex.title}</span>
                    </button>
                  ))}
                </nav>
              </>
            ) : (
              <div className="exp-comp-sidebar">
                {CATALOG_GROUPS.map((grp) => (
                  <div key={grp} className="exp-comp-group">
                    <div className="exp-sidebar-heading">{grp}</div>
                    <div className="exp-nav">
                      {CATALOG_REFERENCE.filter((c) => c.group === grp).map((comp) => {
                        const active = comp.name === selectedCompName;
                        return (
                          <button
                            key={comp.name}
                            ref={active ? activeNavRef : null}
                            type="button"
                            data-comp-nav={comp.name}
                            className={`exp-comp-item ${active ? 'is-active' : ''}`}
                            onClick={() => setSelectedCompName(comp.name)}
                          >
                            <span className="exp-comp-idx">{String(comp.index).padStart(2, '0')}</span>
                            <span className="exp-comp-name">{comp.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <main className="exp-stage">
            {mode === 'showcases' ? (
              <div className="exp-stage-meta">
                <div>
                  <h1 className="exp-stage-title">{selectedExample.title}</h1>
                  <p className="exp-stage-desc">{selectedExample.description}</p>
                </div>
                <div className="exp-tags">
                  {selectedExample.componentsUsed.map((c) => (
                    <span key={c} className="exp-tag">{c}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="exp-comp-header">
                <div className="exp-comp-header-top">
                  <div className="exp-comp-pills">
                    <span className="exp-comp-counter">
                      Component {selectedComponent.index} of 41 · {selectedComponent.group}
                    </span>
                    <span className="exp-env-pill">
                      {theme === 'light' ? 'Light Mode' : 'Dark Mode'} · {deviceLabel}
                    </span>
                  </div>
                  <div className="exp-step-btns">
                    <button type="button" className="exp-step-btn" onClick={() => stepComponent(-1)} aria-label="Previous component">
                      <ChevronLeft size={15} />
                    </button>
                    <button type="button" className="exp-step-btn" onClick={() => stepComponent(1)} aria-label="Next component">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
                <h1 className="exp-stage-title">{selectedComponent.name}</h1>
                <p className="exp-stage-desc">{selectedComponent.summary}</p>
                <div className="exp-tl-guidance">
                  <div>
                    <strong>When to use:</strong> {selectedComponent.whenToUse}
                  </div>
                  <div>
                    <strong>Theme & Screens:</strong> {selectedComponent.platformNote}
                  </div>
                </div>
              </div>
            )}

            <div className={`exp-frame-outer exp-frame-${device}`}>
              {device === 'tablet' && <div className="exp-ipad-cam" aria-hidden="true" />}
              {device === 'mobile' && <div className="exp-iphone-notch" aria-hidden="true" />}
              <div className="exp-frame-inner">
                <LuminaProvider
                  theme={theme}
                  viewport={device === 'mobile' ? 'mobile' : 'desktop'}
                >
                  {surfaces.map((s) => (
                    <LuminaSurface key={s.id} surface={s} />
                  ))}
                </LuminaProvider>
              </div>
            </div>
          </main>

          <aside className="exp-inspector">
            <div className="exp-inspector-tabs">
              {mode === 'components' && (
                <button
                  type="button"
                  className={`exp-insp-tab ${inspectorTab === 'props' ? 'is-active' : ''}`}
                  onClick={() => setInspectorTab('props')}
                >
                  <ListChecks size={14} />
                  <span>Properties ({selectedComponent.properties.length})</span>
                </button>
              )}
              <button
                type="button"
                className={`exp-insp-tab ${inspectorTab === 'json' ? 'is-active' : ''}`}
                onClick={() => setInspectorTab('json')}
              >
                <Code2 size={14} />
                <span>A2UI v1.0 JSON</span>
              </button>
              <button
                type="button"
                className={`exp-insp-tab ${inspectorTab === 'data' ? 'is-active' : ''}`}
                onClick={() => setInspectorTab('data')}
              >
                <Database size={14} />
                <span>DataModel</span>
              </button>
              <button
                type="button"
                className={`exp-insp-tab ${inspectorTab === 'actions' ? 'is-active' : ''}`}
                onClick={() => setInspectorTab('actions')}
              >
                <Terminal size={14} />
                <span>Actions ({actionLogs.length})</span>
              </button>
            </div>

            {inspectorTab === 'props' && mode === 'components' && (
              <div className="exp-props-pane">
                <div className="exp-props-header">
                  <span className="exp-props-title">{selectedComponent.name} Properties Definition</span>
                  <span className="exp-props-sub">Plain-English A2UI v1.0 Contract</span>
                </div>
                <div className="exp-props-list">
                  {selectedComponent.properties.map((p) => (
                    <div key={p.name} className="exp-prop-card">
                      <div className="exp-prop-top">
                        <code className="exp-prop-name">{p.name}</code>
                        <span className={`exp-prop-req ${p.required ? 'is-req' : 'is-opt'}`}>
                          {p.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="exp-prop-type">{p.typeLabel}</div>
                      <div className="exp-prop-desc">{p.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inspectorTab === 'json' && (
              <div className="exp-insp-pane">
                <textarea
                  className="exp-json-editor"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  spellCheck={false}
                />
                {jsonError && <div className="exp-json-error">{jsonError}</div>}
                <button type="button" className="exp-apply-btn" onClick={applyEditedJson}>
                  Apply A2UI Payload
                </button>
              </div>
            )}

            {inspectorTab === 'data' && (
              <div className="exp-insp-pane">
                <pre className="exp-pre">{JSON.stringify(dataSnapshot, null, 2)}</pre>
              </div>
            )}

            {inspectorTab === 'actions' && (
              <div className="exp-insp-pane">
                {actionLogs.length === 0 ? (
                  <div className="exp-empty">Interact with buttons, approvals, or pills to inspect outbound A2UI v1.0 actions.</div>
                ) : (
                  actionLogs.map((log) => (
                    <div key={log.id} className="exp-action-entry">
                      <div className="exp-action-time">{log.time}</div>
                      <pre className="exp-pre">{JSON.stringify(log.action, null, 2)}</pre>
                    </div>
                  ))
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

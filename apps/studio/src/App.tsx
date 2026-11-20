import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageProcessor, type SurfaceModel } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import { processLuminaMessages } from '@a2ui-catalog/core';
import {
  AdaptiveOverlay,
  LuminaIconGlyph,
  LuminaProvider,
  LuminaSurface,
  luminaReactCatalog,
  springFluid,
  springSheet,
  springTactile,
  type LuminaArtifactOpenRequest,
} from '@a2ui-catalog/react';
import {
  ArrowUp,
  Code2,
  Columns2,
  KeyRound,
  Monitor,
  Moon,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import {
  fetchAgentHealth,
  streamA2aTurn,
  type AgentHealth,
} from './a2a-client';
import './App.css';

interface ChatTurn {
  id: string;
  role: 'user' | 'agent';
  text: string;
  actionTag?: string;
  surfaceIds: string[];
}

const FALLBACK_SCENARIOS = [
  {
    id: 'tokyo-travel',
    title: 'Executive Tokyo Concierge',
    subtitle: 'Flight matrix, boutique hotels, interactive fare builder & boarding pass',
    badge: 'Multi-Turn HITL',
    prompt: 'Plan a 4-day executive trip to Tokyo in May with nonstop business flights and boutique hotels.',
    icon: 'flight',
  },
  {
    id: 'deep-research',
    title: 'AI Semiconductor Deep Research',
    subtitle: 'Grounded citations, KPI sparklines, interactive area charts, sortable table & side memo',
    badge: 'Deep Research',
    prompt: 'Synthesize Q3 AI semiconductor market growth, hyperscaler capex, and gross margins with sources.',
    icon: 'chartBar',
  },
  {
    id: 'devops-copilot',
    title: 'Production Incident & Hotfix Copilot',
    subtitle: 'Live triage timeline, latency chart, SQL diagnostics, split diff & check-gated rollout',
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

function renderInlineProse(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={idx} className="studio-inline-code">
        {part.slice(1, -1)}
      </code>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    ),
  );
}

function initialSxsFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('sxs') === '1';
}

export function App() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [sxsOpen, setSxsOpen] = React.useState<boolean>(initialSxsFromUrl);
  const [health, setHealth] = React.useState<AgentHealth | null>(null);
  const [turns, setTurns] = React.useState<ChatTurn[]>([]);
  const [input, setInput] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [xrayOpen, setXrayOpen] = React.useState(false);
  const [rawFrames, setRawFrames] = React.useState<Record<string, unknown>[]>([]);
  const [activeArtifact, setActiveArtifact] = React.useState<LuminaArtifactOpenRequest | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [geminiApiKey, setGeminiApiKey] = React.useState('');
  const [surfaceVersion, setSurfaceVersion] = React.useState(0);
  const [contextId, setContextId] = React.useState(() => `ctx-${Date.now()}`);

  const sendActionRef = React.useRef<((action: Record<string, unknown>) => void) | null>(null);
  const webScrollRef = React.useRef<HTMLDivElement>(null);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);
  const threadEndRef = React.useRef<HTMLDivElement>(null);
  const mobileEndRef = React.useRef<HTMLDivElement>(null);
  const syncingScrollRef = React.useRef(false);

  const processor = React.useMemo(() => {
    return new MessageProcessor<ReactCatalogComponent>([luminaReactCatalog], (action) => {
      sendActionRef.current?.(action as unknown as Record<string, unknown>);
    });
  }, []);

  React.useEffect(() => {
    fetchAgentHealth()
      .then((h) => setHealth(h))
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      mobileEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(raf);
  }, [turns.length, surfaceVersion]);

  const handleWebScroll = () => {
    if (!sxsOpen || syncingScrollRef.current) return;
    const webEl = webScrollRef.current;
    const mobEl = mobileScrollRef.current;
    if (!webEl || !mobEl) return;
    const webMax = webEl.scrollHeight - webEl.clientHeight;
    const mobMax = mobEl.scrollHeight - mobEl.clientHeight;
    if (webMax <= 0 || mobMax <= 0) return;
    syncingScrollRef.current = true;
    mobEl.scrollTop = (webEl.scrollTop / webMax) * mobMax;
    requestAnimationFrame(() => {
      syncingScrollRef.current = false;
    });
  };

  const dispatchTurn = React.useCallback(
    async (opts: { text?: string; action?: Record<string, unknown>; userLabel?: string }) => {
      if (streaming) return;
      setError(null);
      setStreaming(true);

      const userTurnId = `u-${Date.now()}`;
      const agentTurnId = `a-${Date.now() + 1}`;

      setTurns((prev) => [
        ...prev,
        {
          id: userTurnId,
          role: 'user',
          text: opts.userLabel || opts.text || String(opts.action?.name ?? 'Action'),
          actionTag: opts.action ? String(opts.action.name ?? '') : undefined,
          surfaceIds: [],
        },
        {
          id: agentTurnId,
          role: 'agent',
          text: '',
          surfaceIds: [],
        },
      ]);

      try {
        await streamA2aTurn({
          contextId,
          text: opts.text,
          action: opts.action,
          geminiApiKey,
          callbacks: {
            onRawFrame: (frame) => {
              setRawFrames((prev) => [frame, ...prev.slice(0, 39)]);
            },
            onText: (chunkText) => {
              setTurns((prev) =>
                prev.map((t) =>
                  t.id === agentTurnId
                    ? { ...t, text: t.text ? `${t.text}\n${chunkText}` : chunkText }
                    : t,
                ),
              );
            },
            onA2uiMessage: (msg) => {
              processLuminaMessages(processor, [msg]);
              const cs = msg.createSurface as { surfaceId?: string } | undefined;
              const uc = msg.updateComponents as { surfaceId?: string } | undefined;
              const sid = cs?.surfaceId ?? uc?.surfaceId;
              if (sid) {
                setTurns((prev) =>
                  prev.map((t) =>
                    t.id === agentTurnId && !t.surfaceIds.includes(sid)
                      ? { ...t, surfaceIds: [...t.surfaceIds, sid] }
                      : t,
                  ),
                );
              }
              setSurfaceVersion((v) => v + 1);
            },
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setStreaming(false);
      }
    },
    [contextId, geminiApiKey, processor, streaming],
  );

  sendActionRef.current = (action) => {
    const label =
      typeof action.userMessage === 'string' && action.userMessage.trim()
        ? action.userMessage
        : `Triggered ${String(action.name ?? 'action')}`;
    void dispatchTurn({ action, userLabel: label });
  };

  const resetSession = () => {
    for (const sid of Array.from(processor.model.surfacesMap.keys())) {
      try {
        processor.processMessages([{ version: '1.0', deleteSurface: { surfaceId: sid } }] as never);
      } catch {
        // ignore
      }
    }
    setTurns([]);
    setRawFrames([]);
    setActiveArtifact(null);
    setError(null);
    setContextId(`ctx-${Date.now()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    setInput('');
    void dispatchTurn({ text: trimmed });
  };

  const scenarios = health?.scenarios ?? FALLBACK_SCENARIOS;
  const activeMode = geminiApiKey.trim()
    ? 'Live Gemini'
    : health?.mode === 'gemini'
      ? 'Live Gemini'
      : 'Interactive Replay';

  const getSurface = (sid: string): SurfaceModel<ReactCatalogComponent> | undefined =>
    processor.model.surfacesMap.get(sid);

  const renderTurnList = (endRef: React.RefObject<HTMLDivElement | null>, isMobileMirror = false) =>
    turns.length === 0 ? (
      <div className={`studio-hero ${isMobileMirror ? 'is-mobile-mirror' : ''}`}>
        <motion.div
          className="studio-hero-badge"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles size={14} />
          <span>A2UI v1.0 · Unified Web & Mobile Surfaces</span>
        </motion.div>
        <motion.h1
          className="studio-hero-title"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          What can Lumina build for you?
        </motion.h1>
        <p className="studio-hero-sub">
          Launch a multi-turn workflow below to see live A2UI v1.0 components that share the exact same design and adapt automatically to Web and Mobile screens.
        </p>

        <div className={`studio-scenario-grid ${isMobileMirror ? 'is-mobile-grid' : ''}`}>
          {scenarios.map((sc, idx) => (
            <motion.button
              key={sc.id}
              type="button"
              className="studio-scenario-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + idx * 0.04, ...springFluid }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => void dispatchTurn({ text: sc.prompt })}
            >
              <div className="studio-scenario-top">
                <span className="studio-scenario-icon">
                  <LuminaIconGlyph name={sc.icon} size="sm" />
                </span>
                <span className="studio-scenario-badge">{sc.badge}</span>
              </div>
              <div className="studio-scenario-title">{sc.title}</div>
              <div className="studio-scenario-sub">{sc.subtitle}</div>
            </motion.button>
          ))}
        </div>
      </div>
    ) : (
      <div className="studio-messages" data-surface-ver={surfaceVersion}>
        {turns.map((turn) => (
          <div key={turn.id} className={`studio-turn studio-turn-${turn.role}`}>
            {turn.role === 'user' ? (
              <div className="studio-user-bubble">
                {turn.actionTag && <span className="studio-action-chip">{turn.actionTag}</span>}
                <span>{turn.text}</span>
              </div>
            ) : (
              <div className="studio-agent-turn">
                {!isMobileMirror && (
                  <div className="studio-agent-avatar">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className="studio-agent-content">
                  {turn.text && <p className="studio-agent-prose">{renderInlineProse(turn.text)}</p>}
                  {turn.surfaceIds.map((sid) => {
                    const surface = getSurface(sid);
                    return surface ? (
                      <div key={sid} className="studio-surface-slot">
                        <LuminaSurface surface={surface} />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {streaming && (
          <div className="studio-streaming-pill">
            <span className="studio-mode-dot" />
            <span>Streaming A2UI v1.0 surface...</span>
          </div>
        )}

        {error && (
          <div className="lumina-callout lumina-callout-critical" role="alert">
            <div className="lumina-callout-content">
              <div className="lumina-callout-title">Agent Connection Error</div>
              <div className="lumina-callout-body">{error}</div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    );

  return (
    <LuminaProvider
      theme={theme}
      viewport={sxsOpen ? 'desktop' : 'auto'}
      onOpenArtifact={(req) => setActiveArtifact(req)}
      className="studio-app"
    >
      <header className="studio-header">
        <div className="studio-header-left">
          <button type="button" className="studio-brand-btn" onClick={resetSession}>
            <span className="studio-logo">
              <Sparkles size={16} />
            </span>
            <span className="studio-brand-name">Lumina</span>
          </button>
          <span className="studio-pill-badge">A2UI v1.0</span>
          <button
            type="button"
            className={`studio-mode-pill ${activeMode === 'Live Gemini' ? 'is-live' : ''}`}
            onClick={() => setSettingsOpen(true)}
            title="Configure Gemini API Key"
          >
            <span className="studio-mode-dot" />
            <span>
              {activeMode === 'Live Gemini' ? (
                'Gemini'
              ) : (
                <>
                  <span className="studio-hide-mobile">Interactive </span>Replay
                </>
              )}
            </span>
          </button>
        </div>

        <div className="studio-header-right">
          {turns.length > 0 && (
            <button type="button" className="studio-icon-pill" onClick={resetSession} title="New session">
              <RotateCcw size={15} />
              <span className="studio-hide-mobile">New Chat</span>
            </button>
          )}
          <button
            type="button"
            className={`studio-icon-pill studio-hide-mobile ${sxsOpen ? 'is-active' : ''}`}
            aria-pressed={sxsOpen}
            onClick={() => setSxsOpen((v) => !v)}
            title="Compare Web and Mobile surfaces side by side"
          >
            <Columns2 size={15} />
            <span>Web × Mobile</span>
          </button>
          <button
            type="button"
            className={`studio-icon-pill ${xrayOpen ? 'is-active' : ''}`}
            onClick={() => setXrayOpen((v) => !v)}
            title="Toggle A2UI v1.0 Protocol X-Ray"
          >
            <Code2 size={15} />
            <span className="studio-hide-mobile">X-Ray</span>
          </button>
          <button
            type="button"
            className="studio-icon-circle"
            aria-label="API Key Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <KeyRound size={15} />
          </button>
          <button
            type="button"
            className="studio-icon-circle"
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      <div className={`studio-main-grid ${sxsOpen ? 'is-sxs' : ''}`}>
        {/* Left / Primary Web Workspace */}
        <div className="studio-web-workspace">
          {sxsOpen && (
            <div className="studio-surface-strip">
              <span className="studio-strip-label">
                <Monitor size={13} />
                <strong>Web Surface</strong>
                <span className="studio-strip-muted">· Wide Desktop Layout</span>
              </span>
              <span className="studio-strip-tag">Same Component · Same Live State</span>
            </div>
          )}

          <div className="studio-web-body">
            <main className="studio-thread-col">
              <div
                ref={webScrollRef}
                onScroll={handleWebScroll}
                className={`studio-thread-scroll ${sxsOpen ? 'is-sxs-scroll' : ''}`}
              >
                {renderTurnList(threadEndRef, false)}
              </div>

              <form className="studio-composer-wrap" onSubmit={handleSubmit}>
                <div className="studio-composer">
                  <input
                    type="text"
                    className="studio-composer-input"
                    placeholder="Ask Lumina to plan a trip, synthesize research, triage an incident, or optimize spend..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={streaming}
                  />
                  <motion.button
                    type="submit"
                    className="studio-send-btn"
                    aria-label="Send message"
                    disabled={!input.trim() || streaming}
                    whileTap={{ scale: 0.92 }}
                    transition={springTactile}
                  >
                    <ArrowUp size={17} strokeWidth={2.4} />
                  </motion.button>
                </div>
              </form>
            </main>

            {/* Split-Screen Desktop Canvas Drawer for ArtifactCard */}
            <AnimatePresence>
              {activeArtifact && (
                <motion.aside
                  className="studio-canvas-pane"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={springFluid}
                >
                  <div className="studio-canvas-header">
                    <div>
                      <div className="studio-canvas-title">{activeArtifact.title}</div>
                      {activeArtifact.subtitle && (
                        <div className="studio-canvas-sub">{activeArtifact.subtitle}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="lumina-icon-btn"
                      aria-label="Close canvas"
                      onClick={() => setActiveArtifact(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="studio-canvas-body">{activeArtifact.content}</div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Optional Protocol X-Ray SSE Frame Inspector */}
            <AnimatePresence>
              {xrayOpen && (
                <motion.aside
                  className="studio-xray-pane"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={springFluid}
                >
                  <div className="studio-canvas-header">
                    <div className="studio-canvas-title">A2UI v1.0 Protocol X-Ray ({rawFrames.length})</div>
                    <button
                      type="button"
                      className="lumina-icon-btn"
                      aria-label="Close X-Ray"
                      onClick={() => setXrayOpen(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="studio-xray-body">
                    {rawFrames.length === 0 ? (
                      <div className="studio-xray-empty">Launch a scenario to inspect streamed A2A JSON-RPC frames.</div>
                    ) : (
                      rawFrames.map((f, i) => (
                        <pre key={i} className="studio-xray-pre">
                          {JSON.stringify(f, null, 2)}
                        </pre>
                      ))
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side-by-Side Live Mobile Surface Mirror */}
        {sxsOpen && (
          <aside className="studio-sxs-pane" aria-label="Mobile Surface Preview">
            <div className="studio-surface-strip">
              <span className="studio-strip-label">
                <Smartphone size={13} />
                <strong>Mobile Surface</strong>
                <span className="studio-strip-muted">· Adaptive Phone Layout</span>
              </span>
              <span className="studio-sync-pill">
                <span className="studio-sync-dot" />
                Live Sync
              </span>
            </div>

            <div className="studio-phone-stage">
              <div className="studio-phone-bezel">
                <div className="studio-phone-notch" aria-hidden="true" />
                <LuminaProvider
                  theme={theme}
                  viewport="mobile"
                  onOpenArtifact={(req) => setActiveArtifact(req)}
                  className="studio-phone-screen"
                >
                  <div className="studio-phone-topbar">
                    <span className="studio-phone-appname">Lumina Mobile</span>
                    <span className="studio-phone-badge">A2UI v1.0</span>
                  </div>

                  <div ref={mobileScrollRef} className="studio-mobile-scroll">
                    {renderTurnList(mobileEndRef, true)}
                  </div>

                  {/* Simultaneous Mobile Bottom Sheet Adaptation when ArtifactCard is opened! */}
                  <AnimatePresence>
                    {activeArtifact && (
                      <motion.div
                        className="studio-phone-sheet-scrim"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="studio-phone-sheet"
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          transition={springSheet}
                        >
                          <div className="lumina-sheet-grabber-wrap" aria-hidden="true">
                            <div className="lumina-sheet-grabber" />
                          </div>
                          <div className="studio-phone-sheet-head">
                            <div>
                              <div className="studio-phone-sheet-title">{activeArtifact.title}</div>
                              {activeArtifact.subtitle && (
                                <div className="studio-phone-sheet-sub">{activeArtifact.subtitle}</div>
                              )}
                            </div>
                            <button
                              type="button"
                              className="lumina-icon-btn"
                              aria-label="Close mobile sheet"
                              onClick={() => setActiveArtifact(null)}
                            >
                              <X size={15} />
                            </button>
                          </div>
                          <div className="studio-phone-sheet-body">{activeArtifact.content}</div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="studio-phone-homebar" aria-hidden="true" />
                </LuminaProvider>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Runtime Gemini API Key Configuration Modal */}
      <AdaptiveOverlay
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        title="Agent Backend Settings"
        description="Use deterministic zero-key Replay mode or connect live Gemini (@google/genai)."
        size="sm"
      >
        <div className="lumina-column" style={{ gap: '14px' }}>
          <div className="lumina-field">
            <label htmlFor="gemini-key" className="lumina-field-label">
              Optional Gemini API Key (Runtime Override)
            </label>
            <div className="lumina-input-shell">
              <input
                id="gemini-key"
                type="password"
                className="lumina-input"
                placeholder="AIza... (leave empty for Interactive Replay)"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
              />
            </div>
            <div className="lumina-field-helper">
              Sent only to your local agent server at <code>localhost:10002</code>.
            </div>
          </div>
          <button
            type="button"
            className="lumina-btn lumina-btn-primary lumina-btn-md is-full"
            onClick={() => setSettingsOpen(false)}
          >
            Save & Continue
          </button>
        </div>
      </AdaptiveOverlay>
    </LuminaProvider>
  );
}

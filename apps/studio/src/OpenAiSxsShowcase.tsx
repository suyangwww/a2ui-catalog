import React from 'react';
import { MessageProcessor, type SurfaceModel } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import { processLuminaMessages } from '@a2ui-catalog/core';
import { LuminaSurface, luminaReactCatalog } from '@a2ui-catalog/react';
import { Code2, Play, Sparkles, X } from 'lucide-react';
import { OPENAI_SXS_SHOWCASES, type OpenAiSxsShowcaseItem } from './openai-sxs-data';
import { OpenAiReferencePane } from './OpenAiMockViews';
import './OpenAiSxsShowcase.css';

function initialExampleFromUrl(): string {
  if (typeof window === 'undefined') return OPENAI_SXS_SHOWCASES[0]!.id;
  const param = new URLSearchParams(window.location.search).get('example');
  const match = OPENAI_SXS_SHOWCASES.find((s) => s.id === param);
  return match ? match.id : OPENAI_SXS_SHOWCASES[0]!.id;
}

export function OpenAiSxsShowcase({ theme }: { theme: 'light' | 'dark' }): React.ReactNode {
  const [selectedId, setSelectedId] = React.useState<string>(initialExampleFromUrl);
  const [surface, setSurface] = React.useState<SurfaceModel<ReactCatalogComponent> | null>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [jsonDrawerOpen, setJsonDrawerOpen] = React.useState(false);
  const [liveDataModel, setLiveDataModel] = React.useState<unknown>({});
  const procRef = React.useRef<MessageProcessor<ReactCatalogComponent> | null>(null);

  const activeItem: OpenAiSxsShowcaseItem =
    OPENAI_SXS_SHOWCASES.find((s) => s.id === selectedId) ?? OPENAI_SXS_SHOWCASES[0]!;

  const mountShowcase = React.useCallback((item: OpenAiSxsShowcaseItem, streamMode: boolean) => {
    setParseError(null);
    const proc = new MessageProcessor<ReactCatalogComponent>([luminaReactCatalog], () => {});
    procRef.current = proc;

    const syncSurface = () => {
      const first = Array.from(proc.model.surfacesMap.values())[0] ?? null;
      setSurface(first);
      if (first) {
        setLiveDataModel(first.dataModel.get('/'));
      }
    };

    if (!streamMode) {
      try {
        processLuminaMessages(proc, item.messages);
        syncSurface();
      } catch (err) {
        setParseError(err instanceof Error ? err.message : String(err));
      }
      return undefined;
    }

    const rawFirst = item.messages[0] as {
      createSurface?: {
        surfaceId: string;
        catalogId: string;
        dataModel?: Record<string, unknown>;
        components?: Array<Record<string, unknown>>;
      };
    };
    const cs = rawFirst?.createSurface;
    if (!cs || !Array.isArray(cs.components) || cs.components.length <= 2) {
      processLuminaMessages(proc, item.messages);
      syncSurface();
      return undefined;
    }

    setIsStreaming(true);
    const root = cs.components.find((c) => c.id === 'root') ?? cs.components[0]!;
    const rest = cs.components.filter((c) => c !== root);

    processLuminaMessages(proc, [
      {
        version: '1.0',
        createSurface: {
          surfaceId: cs.surfaceId,
          catalogId: cs.catalogId,
          ...(cs.dataModel ? { dataModel: cs.dataModel } : {}),
          components: [root, ...rest.slice(0, 1)],
        },
      },
    ]);
    syncSurface();

    let idx = 1;
    const timer = window.setInterval(() => {
      if (idx >= rest.length) {
        window.clearInterval(timer);
        setIsStreaming(false);
        return;
      }
      const batch = rest.slice(idx, idx + 2);
      idx += 2;
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
        syncSurface();
      } catch {
        window.clearInterval(timer);
        setIsStreaming(false);
      }
    }, 110);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const cleanup = mountShowcase(activeItem, false);
    return cleanup;
  }, [activeItem, mountShowcase]);

  React.useEffect(() => {
    if (!jsonDrawerOpen) return undefined;
    const id = window.setInterval(() => {
      const first = procRef.current
        ? Array.from(procRef.current.model.surfacesMap.values())[0]
        : null;
      if (first) {
        setLiveDataModel(first.dataModel.get('/'));
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [jsonDrawerOpen]);

  return (
    <div className="sxs-workbench" data-lumina-theme={theme}>
      <div className="sxs-selector-bar">
        <div className="sxs-rail" role="tablist" aria-label="OpenAI Intelligent UI showcase examples">
          {OPENAI_SXS_SHOWCASES.map((ex) => {
            const active = ex.id === activeItem.id;
            return (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-sxs-example={ex.id}
                className={`sxs-tab-pill ${active ? 'is-active' : ''}`}
                onClick={() => setSelectedId(ex.id)}
              >
                <span className="sxs-tab-idx">{ex.indexLabel}</span>
                <span>{ex.shortTitle}</span>
              </button>
            );
          })}
        </div>

        <div className="sxs-bar-actions">
          <button
            type="button"
            className="sxs-action-btn"
            disabled={isStreaming}
            onClick={() => mountShowcase(activeItem, true)}
          >
            <Play size={13} />
            <span>{isStreaming ? 'Streaming...' : 'Replay Stream'}</span>
          </button>
          <button
            type="button"
            data-testid="sxs-json-btn"
            className={`sxs-action-btn ${jsonDrawerOpen ? 'is-active' : ''}`}
            onClick={() => setJsonDrawerOpen((o) => !o)}
          >
            <Code2 size={14} />
            <span>A2UI JSON</span>
          </button>
        </div>
      </div>

      <div className="sxs-meta-strip">
        <div className="sxs-meta-left">
          <span className="sxs-source-chip">{activeItem.sourceBadge}</span>
          <span className="sxs-parity-note">{activeItem.parityNote}</span>
        </div>
        <div className="sxs-meta-tags">
          {activeItem.componentsUsed.map((c) => (
            <span key={c} className="sxs-comp-chip">{c}</span>
          ))}
          {activeItem.functionsUsed.map((fn) => (
            <span key={fn} className="sxs-fn-chip">@{fn}</span>
          ))}
        </div>
      </div>

      <div className="sxs-columns">
        {/* LEFT PANE: OpenAI Intelligent UI Reference */}
        <section className="sxs-pane sxs-pane-openai" data-testid="openai-left-pane" aria-label="OpenAI Intelligent UI reference">
          <header className="sxs-pane-head">
            <div className="sxs-pane-title">
              <span className="sxs-dot is-openai" />
              <strong>OpenAI Intelligent UI</strong>
              <span className="sxs-pane-muted">· Reference Mock / Official CDN Export</span>
            </div>
            <span className="sxs-arch-tag">Imperative HTML + Worker JS</span>
          </header>
          <div className="sxs-pane-scroll" data-sxs-scroll="left">
            <OpenAiReferencePane item={activeItem} theme={theme} />
          </div>
        </section>

        {/* RIGHT PANE: A2UI Lumina v1.0 Declarative Surface */}
        <section className="sxs-pane sxs-pane-lumina" data-testid="lumina-right-pane" aria-label="A2UI Lumina declarative surface">
          <header className="sxs-pane-head">
            <div className="sxs-pane-title">
              <span className="sxs-dot is-lumina" />
              <strong>A2UI Lumina Catalog (v1.0)</strong>
              <span className="sxs-pane-muted">· Declarative Surface Rebuild</span>
            </div>
            <span className="sxs-arch-tag is-accent">
              <Sparkles size={11} />
              Schema-Validated JSON · 0ms @call / @path
            </span>
          </header>
          <div className="sxs-pane-scroll" data-sxs-scroll="right">
            <div className="sxs-lumina-stage">
              <div className="oai-prompt-row">
                <div className="oai-prompt-bubble">{activeItem.prompt}</div>
              </div>
              {parseError ? (
                <div className="lumina-callout lumina-callout-critical" role="alert">
                  <strong>Schema Validation Error:</strong> {parseError}
                </div>
              ) : (
                surface && <LuminaSurface surface={surface} />
              )}
            </div>
          </div>
        </section>

        {jsonDrawerOpen && (
          <aside className="sxs-json-drawer" aria-label="A2UI v1.0 Wire JSON and DataModel">
            <div className="sxs-json-head">
              <strong>A2UI v1.0 Declarative Payload &amp; Live DataModel</strong>
              <button
                type="button"
                className="sxs-close-btn"
                aria-label="Close JSON inspector"
                onClick={() => setJsonDrawerOpen(false)}
              >
                <X size={15} />
              </button>
            </div>
            <div className="sxs-json-body">
              <div className="sxs-json-label">Live Reactive DataModel (`/`)</div>
              <pre>{JSON.stringify(liveDataModel, null, 2)}</pre>
              <div className="sxs-json-label">Streamed A2UI v1.0 Messages (`catalogId: lumina`)</div>
              <pre>{JSON.stringify(activeItem.messages, null, 2)}</pre>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { MessageProcessor } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import {
  LUMINA_V1_CATALOG_ID,
  processLuminaMessages,
} from '../protocol/index.js';
import { isPlainRecord, readRecordArray, readString } from '../primitives/index.js';
import { catalogRegistry, type AnyComponentSlice } from '../catalog/index.js';
import {
  LuminaProvider,
  LuminaSurface,
  luminaReactCatalog,
} from '../catalog/react-adapter.js';

interface ParsedExample {
  title: string;
  props: Record<string, unknown>;
  children: Array<Record<string, unknown>>;
  dataModel?: Record<string, unknown> | undefined;
}

const rawExampleModules = import.meta.glob('../components/*/examples.json', {
  eager: true,
});

function extractExamplesForSlug(slug: string): ParsedExample[] {
  const key = `../components/${slug}/examples.json`;
  const mod = rawExampleModules[key];
  const rawList = isPlainRecord(mod) && 'default' in mod ? mod.default : mod;
  const records = readRecordArray(rawList);
  return records.map((rec, idx) => ({
    title: readString(rec.title, `${slug} example #${idx + 1}`),
    props: isPlainRecord(rec.props) ? rec.props : {},
    children: readRecordArray(rec.children),
    dataModel: isPlainRecord(rec.dataModel) ? rec.dataModel : undefined,
  }));
}

function buildSurfaceForSlice(slice: AnyComponentSlice, exampleIdx: number) {
  const examples = extractExamplesForSlug(slice.slug);
  const chosen = examples[exampleIdx] ?? examples[0];
  const rootComp: Record<string, unknown> = {
    id: 'root',
    component: slice.id,
    ...(chosen ? chosen.props : {}),
  };
  const components = [rootComp, ...(chosen ? chosen.children : [])];
  const createSurfacePayload: Record<string, unknown> = {
    surfaceId: `preview-${slice.slug}`,
    catalogId: LUMINA_V1_CATALOG_ID,
    components,
  };
  if (chosen?.dataModel) {
    createSurfacePayload.dataModel = chosen.dataModel;
  }

  const processor = new MessageProcessor<ReactCatalogComponent>([luminaReactCatalog], () => {});
  processLuminaMessages(processor, [
    {
      version: '1.0',
      createSurface: createSurfacePayload,
    },
  ]);
  return Array.from(processor.model.surfacesMap.values())[0] ?? null;
}

export function PreviewApp(): React.ReactNode {
  const slices = catalogRegistry.listComponents();
  const initialParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const initialMode = initialParams?.get('mode') === 'all' ? 'all' : 'single';
  const initialSlug = initialParams?.get('component') ?? slices[0]?.slug ?? 'row';
  const initialTheme = initialParams?.get('theme') === 'dark' ? 'dark' : 'light';
  const initialViewport = initialParams?.get('viewport') === 'mobile' ? 'mobile' : 'desktop';
  const initialExample = Number(initialParams?.get('example') ?? '0') || 0;

  const [mode, setMode] = React.useState<'single' | 'all'>(initialMode);
  const [activeSlug, setActiveSlug] = React.useState<string>(initialSlug);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(initialTheme);
  const [viewport, setViewport] = React.useState<'desktop' | 'mobile'>(initialViewport);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.harnessTheme = theme;
    }
  }, [theme]);

  const activeSlice = catalogRegistry.getComponentBySlug(activeSlug) ?? slices[0];

  const singleSurface = React.useMemo(() => {
    if (!activeSlice || mode === 'all') return null;
    return buildSurfaceForSlice(activeSlice, initialExample);
  }, [activeSlice, initialExample, mode]);

  const allSurfaces = React.useMemo(() => {
    if (mode !== 'all') return [];
    return slices.map((slice) => ({
      slice,
      surface: buildSurfaceForSlice(slice, 0),
    }));
  }, [mode, slices]);

  return (
    <div className="preview-shell">
      <nav className="preview-nav" aria-label="Catalog component slices">
        <div className="preview-nav-title">Lumina Slices ({slices.length})</div>
        <button
          type="button"
          className={`preview-nav-btn ${mode === 'all' ? 'is-active' : ''}`.trim()}
          onClick={() => setMode('all')}
        >
          <span>All 41 Fixtures</span>
          <span>41</span>
        </button>
        {slices.map((slice) => {
          const isCurrent = mode === 'single' && slice.slug === activeSlice?.slug;
          return (
            <button
              key={slice.slug}
              type="button"
              className={`preview-nav-btn ${isCurrent ? 'is-active' : ''}`.trim()}
              onClick={() => {
                setMode('single');
                setActiveSlug(slice.slug);
              }}
            >
              <span>{slice.id}</span>
            </button>
          );
        })}
      </nav>

      <div className="preview-stage">
        <header className="preview-toolbar">
          <div>
            <strong>{mode === 'all' ? 'All 41 Component Fixtures' : activeSlice?.id}</strong>
          </div>
          <div className="preview-controls">
            <button
              type="button"
              className={`preview-pill ${theme === 'light' ? 'is-active' : ''}`.trim()}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              className={`preview-pill ${theme === 'dark' ? 'is-active' : ''}`.trim()}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              type="button"
              className={`preview-pill ${viewport === 'desktop' ? 'is-active' : ''}`.trim()}
              onClick={() => setViewport('desktop')}
            >
              Desktop
            </button>
            <button
              type="button"
              className={`preview-pill ${viewport === 'mobile' ? 'is-active' : ''}`.trim()}
              onClick={() => setViewport('mobile')}
            >
              Mobile
            </button>
          </div>
        </header>

        <main
          data-testid="preview-canvas"
          aria-label="Component preview canvas"
          className={`preview-canvas-frame ${viewport === 'mobile' ? 'is-mobile' : ''}`.trim()}
        >
          <LuminaProvider theme={theme} viewport={viewport}>
            {mode === 'all' ? (
              <div className="preview-all-grid">
                {allSurfaces.map(({ slice, surface }) => (
                  <section
                    key={slice.slug}
                    data-slice-slug={slice.slug}
                    aria-label={`${slice.id} fixture`}
                    className="preview-all-card"
                  >
                    <div className="preview-all-label">{slice.id}</div>
                    {surface && <LuminaSurface surface={surface} />}
                  </section>
                ))}
              </div>
            ) : (
              singleSurface && <LuminaSurface surface={singleSurface} />
            )}
          </LuminaProvider>
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  A2uiSurface,
  MarkdownContext,
  createComponentImplementation,
  type ReactCatalogComponent,
} from '@a2ui/react';
import { renderMarkdown } from '@a2ui/markdown-it';
import { Catalog, type FunctionImplementation, type SurfaceModel } from '@a2ui/web_core';
import type { LuminaThemeMode } from '@a2ui-catalog/tokens';
import { Check } from 'lucide-react';
import {
  LUMINA_PROTOCOL_VERSION,
  LUMINA_V1_CATALOG_ID,
  subscribeLuminaToasts,
} from '../protocol/index.js';
import {
  LuminaHostContext,
  type LuminaArtifactOpenRequest,
} from '../primitives/index.js';
import { LUMINA_CATALOG_DOCUMENT_OPTIONS } from './instructions.js';
import { ALL_COMPONENT_SLICES, LUMINA_FUNCTIONS, type AnyComponentSlice } from './registry.js';

function isElementRefCallback(val: unknown): val is (el: Element | null) => void {
  return typeof val === 'function';
}

function toReactCatalogComponent(slice: AnyComponentSlice): ReactCatalogComponent {
  const SliceRenderer = slice.renderer;
  return createComponentImplementation(slice.api, (args) => {
    const accessibilityRef =
      'accessibilityRef' in args && isElementRefCallback(args.accessibilityRef)
        ? args.accessibilityRef
        : undefined;
    const validationErrorsRef =
      'validationErrorsRef' in args && isElementRefCallback(args.validationErrorsRef)
        ? args.validationErrorsRef
        : undefined;
    return (
      <SliceRenderer
        props={args.props}
        buildChild={args.buildChild}
        accessibilityRef={accessibilityRef}
        validationErrorsRef={validationErrorsRef}
      />
    );
  });
}

export const LUMINA_REACT_COMPONENTS: readonly ReactCatalogComponent[] =
  ALL_COMPONENT_SLICES.map(toReactCatalogComponent);

export function createLuminaReactCatalog(options?: {
  catalogId?: string | undefined;
}): Catalog<ReactCatalogComponent, FunctionImplementation> {
  const id = options?.catalogId ?? LUMINA_V1_CATALOG_ID;
  return new Catalog<ReactCatalogComponent, FunctionImplementation>(
    id,
    LUMINA_PROTOCOL_VERSION,
    [...LUMINA_REACT_COMPONENTS],
    [...LUMINA_FUNCTIONS],
    {
      ...LUMINA_CATALOG_DOCUMENT_OPTIONS,
      schemaId: id,
    },
  );
}

export const luminaReactCatalog = createLuminaReactCatalog();

export interface LuminaProviderProps {
  theme?: LuminaThemeMode | undefined;
  viewport?: 'auto' | 'desktop' | 'mobile' | undefined;
  onOpenArtifact?: ((req: LuminaArtifactOpenRequest) => void) | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}

export function LuminaProvider({
  theme = 'light',
  viewport = 'auto',
  onOpenArtifact,
  className,
  children,
}: LuminaProviderProps) {
  const [toast, setToast] = React.useState<{ id: number; text: string } | null>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = subscribeLuminaToasts((msg) => {
      const id = Date.now();
      setToast({ id, text: msg });
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2200);
    });
    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const resolvedThemeAttr = theme === 'system' ? undefined : theme;

  const hostValue = React.useMemo(
    () => ({
      theme,
      viewport,
      openArtifact: onOpenArtifact,
      markdownRenderer: renderMarkdown,
    }),
    [theme, viewport, onOpenArtifact],
  );

  return (
    <MotionConfig reducedMotion="user">
      <MarkdownContext.Provider value={renderMarkdown}>
        <LuminaHostContext.Provider value={hostValue}>
          <div
            className={`lumina-root ${className ?? ''}`.trim()}
            data-lumina-theme={resolvedThemeAttr}
            data-lumina-viewport={viewport}
          >
            {children}
            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.id}
                  role="status"
                  aria-live="polite"
                  className="lumina-toast"
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>{toast.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LuminaHostContext.Provider>
      </MarkdownContext.Provider>
    </MotionConfig>
  );
}

class SurfaceErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="lumina-callout lumina-tone-critical" role="alert">
          <div className="lumina-callout-title">Surface Render Error</div>
          <div className="lumina-callout-body">{this.state.error.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function LuminaSurface({
  surface,
  className,
}: {
  surface: SurfaceModel<ReactCatalogComponent>;
  className?: string | undefined;
}) {
  return (
    <div className={`lumina-surface ${className ?? ''}`.trim()} data-surface-id={surface.id}>
      <SurfaceErrorBoundary>
        <A2uiSurface surface={surface} />
      </SurfaceErrorBoundary>
    </div>
  );
}

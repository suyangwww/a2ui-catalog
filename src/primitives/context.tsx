import React from 'react';
import { sanitizeMediaUrl, type ResolvedChildRef } from '@a2ui/web_core/v1_0';
import { renderMarkdown } from '@a2ui/markdown-it';
import type { LuminaRenderArgs } from '../protocol/index.js';
import { isPlainRecord, readStringArray } from './value-readers.js';

export type BuildChildFn = (id: string, basePath?: string) => React.ReactNode;
export type LuminaReactRenderArgs = LuminaRenderArgs<React.ReactNode>;
export type LuminaReactRenderer = (args: LuminaReactRenderArgs) => React.ReactNode;

function isResolvedChildRef(val: unknown): val is ResolvedChildRef {
  return isPlainRecord(val) && typeof val.id === 'string' && typeof val.basePath === 'string';
}

export function renderChildRef(
  buildChild: BuildChildFn,
  ref: unknown,
  fallbackKey?: number | string,
): React.ReactNode {
  if (!ref) return null;
  if (typeof ref === 'string') {
    return <React.Fragment key={ref}>{buildChild(ref)}</React.Fragment>;
  }
  if (isResolvedChildRef(ref)) {
    const key = `${ref.id}:${ref.basePath}:${fallbackKey ?? ''}`;
    return <React.Fragment key={key}>{buildChild(ref.id, ref.basePath)}</React.Fragment>;
  }
  return null;
}

export function normalizeChildList(children: unknown): Array<string | ResolvedChildRef> {
  if (!Array.isArray(children)) return [];
  const list: Array<string | ResolvedChildRef> = [];
  for (const item of children) {
    if (typeof item === 'string' || isResolvedChildRef(item)) {
      list.push(item);
    }
  }
  return list;
}

export function childRefKey(ref: string | ResolvedChildRef, idx: number): string {
  return typeof ref === 'string' ? ref : `${ref.id}:${ref.basePath}:${idx}`;
}

export function weightStyle(
  weight: unknown,
): { flex: string; minWidth: number } | undefined {
  if (typeof weight === 'number' && Number.isFinite(weight) && weight > 0) {
    return { flex: `${weight} 1 0%`, minWidth: 0 };
  }
  return undefined;
}

export function safeUrl(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s) return '';
  if (s.startsWith('/') || s.startsWith('./') || s.startsWith('../')) return s;
  if (/^data:image\/svg\+xml;/i.test(s) && !/<script/i.test(s) && !/on\w+=/i.test(s)) {
    return s;
  }
  if (/^data:audio\/(wav|mpeg|ogg|mp3);/i.test(s)) {
    return s;
  }
  try {
    return sanitizeMediaUrl(s) ?? '';
  } catch {
    if (/^https?:\/\//i.test(s) || /^data:image\/(png|jpeg|jpg|webp|gif);/i.test(s)) {
      return s;
    }
    return '';
  }
}

export interface LuminaArtifactOpenRequest {
  title: string;
  subtitle?: string | undefined;
  kind?: string | undefined;
  version?: string | undefined;
  content: React.ReactNode;
}

export type LuminaMarkdownRenderer = (markdown: string) => string | Promise<string>;

export interface LuminaHostContextValue {
  theme?: 'light' | 'dark' | 'system' | undefined;
  viewport: 'auto' | 'desktop' | 'mobile';
  openArtifact?: ((req: LuminaArtifactOpenRequest) => void) | undefined;
  markdownRenderer?: LuminaMarkdownRenderer | undefined;
}

export const LuminaHostContext = React.createContext<LuminaHostContextValue>({
  theme: undefined,
  viewport: 'auto',
  markdownRenderer: renderMarkdown,
});

export function useIsMobileViewport(): boolean {
  const { viewport } = React.useContext(LuminaHostContext);
  const [narrow, setNarrow] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  React.useEffect(() => {
    if (viewport !== 'auto' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [viewport]);

  if (viewport === 'mobile') return true;
  if (viewport === 'desktop') return false;
  return narrow;
}

export function ValidationErrors({
  errors,
  validationErrorsRef,
}: {
  errors?: unknown;
  validationErrorsRef?: ((el: Element | null) => void) | undefined;
}) {
  const list = readStringArray(errors).filter(Boolean);
  return (
    <div
      ref={validationErrorsRef}
      className="lumina-validation-errors"
      aria-live="polite"
      data-has-errors={list.length > 0 ? 'true' : 'false'}
    >
      {list.map((err, i) => (
        <span key={i} className="lumina-validation-error-item">
          {err}
        </span>
      ))}
    </div>
  );
}

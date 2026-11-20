import type React from 'react';

declare module 'react' {
  interface CSSProperties {
    '--pct'?: string | undefined;
  }
}

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  if (isPlainRecord(value)) {
    return typeof value['@path'] === 'string' ? value['@path'] : fallback;
  }
  return String(value);
}

export function readOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (isPlainRecord(value)) {
    return typeof value['@path'] === 'string' ? value['@path'] : undefined;
  }
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function readOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return undefined;
}

export function readBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  return fallback;
}

export function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item !== null && item !== undefined)
    .map((item) => String(item));
}

export function readNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const result: number[] = [];
  for (const item of value) {
    const num = Number(item);
    if (Number.isFinite(num)) result.push(num);
  }
  return result;
}

export function readRecordArray(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.filter(isPlainRecord);
}

export function isCallable(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

export async function invokeAction(action: unknown): Promise<void> {
  if (isCallable(action)) {
    await action();
  }
}

export function invokeSetter(setter: unknown, nextValue: unknown): void {
  if (isCallable(setter)) {
    setter(nextValue);
  }
}

export type OverlaySize = 'sm' | 'md' | 'lg' | 'fullscreen';

export function readOverlaySize(value: unknown, fallback: OverlaySize = 'md'): OverlaySize {
  if (value === 'sm' || value === 'md' || value === 'lg' || value === 'fullscreen') {
    return value;
  }
  return fallback;
}

export type IconGlyphSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function readIconSize(value: unknown, fallback: IconGlyphSize = 'md'): IconGlyphSize {
  if (value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') {
    return value;
  }
  return fallback;
}

export function readTextAlign(
  value: unknown,
  fallback: React.CSSProperties['textAlign'] = 'start',
): React.CSSProperties['textAlign'] {
  if (value === 'start' || value === 'center' || value === 'end') {
    return value;
  }
  return fallback;
}

export const JUSTIFY_MAP: Readonly<Record<string, React.CSSProperties['justifyContent']>> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
  stretch: 'stretch',
};

export const ALIGN_MAP: Readonly<Record<string, React.CSSProperties['alignItems']>> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

export const GAP_VAR: Readonly<Record<string, string>> = {
  none: '0px',
  xs: 'var(--lumina-space-xs)',
  sm: 'var(--lumina-space-sm)',
  md: 'var(--lumina-space-md)',
  lg: 'var(--lumina-space-lg)',
  xl: 'var(--lumina-space-xl)',
};

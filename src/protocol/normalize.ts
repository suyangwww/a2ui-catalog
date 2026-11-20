import { MessageProcessor, type Catalog, type ComponentApi } from '@a2ui/web_core';
import { LUMINA_V1_CATALOG_ID } from './constants.js';

function isPlainRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function normalizeComponentEnvelope(comp: unknown): unknown {
  if (!isPlainRecord(comp)) return comp;
  const next: Record<string, unknown> = { ...comp };
  if ('@checks' in next && !('checks' in next)) {
    next.checks = next['@checks'];
    delete next['@checks'];
  }
  if ('@accessibility' in next && !('accessibility' in next)) {
    next.accessibility = next['@accessibility'];
    delete next['@accessibility'];
  }
  if ('@metadata' in next && !('metadata' in next)) {
    next.metadata = next['@metadata'];
    delete next['@metadata'];
  }
  return next;
}

/**
 * Normalizes A2UI v1.0 `@`-prefixed component envelope directives (`@checks`,
 * `@accessibility`, `@metadata`) for `@a2ui/web_core` runtime compatibility
 * while keeping wire payloads 100% A2UI v1.0 compliant.
 */
export function normalizeLuminaV1Messages(
  messages: readonly unknown[],
  options?: { remapBasicCatalogToLumina?: boolean },
): unknown[] {
  return messages.map((raw) => {
    if (!isPlainRecord(raw)) return raw;

    if (isPlainRecord(raw.createSurface)) {
      const cs: Record<string, unknown> = { ...raw.createSurface };
      if (
        options?.remapBasicCatalogToLumina &&
        typeof cs.catalogId === 'string' &&
        cs.catalogId.includes('/catalogs/basic/')
      ) {
        cs.catalogId = LUMINA_V1_CATALOG_ID;
      }
      if (Array.isArray(cs.components)) {
        cs.components = cs.components.map((c) => normalizeComponentEnvelope(c));
      }
      return { ...raw, createSurface: cs };
    }

    if (isPlainRecord(raw.updateComponents)) {
      const uc: Record<string, unknown> = { ...raw.updateComponents };
      if (Array.isArray(uc.components)) {
        uc.components = uc.components.map((c) => normalizeComponentEnvelope(c));
      }
      return { ...raw, updateComponents: uc };
    }

    return raw;
  });
}

/**
 * Processes A2UI v1.0 messages into a `MessageProcessor` with automatic
 * `@checks` / `@accessibility` v1.0 directive normalization and strict error propagation.
 */
export function processLuminaMessages<T extends ComponentApi>(
  processor: MessageProcessor<T>,
  messages: readonly unknown[],
  options?: { remapBasicCatalogToLumina?: boolean },
): void {
  const normalized = normalizeLuminaV1Messages(messages, options);
  const errors = processor.processMessagesWithErrors(normalized);
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.error.message).join('; '));
  }
}

export type { Catalog };

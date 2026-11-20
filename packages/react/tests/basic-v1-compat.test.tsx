import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { MessageProcessor } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import { processLuminaMessages } from '@a2ui-catalog/core';
import { LuminaProvider, LuminaSurface, luminaReactCatalog } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.resolve(__dirname, '../../schema/vendor/v1_0/basic_examples');

afterEach(() => cleanup());

describe('Lumina React Renderer — Upstream A2UI v1.0 Basic Catalog Compatibility (43 Examples)', () => {
  const files = fs
    .readdirSync(examplesDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  it('discovers all synced upstream Basic Catalog v1.0 golden examples', () => {
    expect(files.length).toBeGreaterThanOrEqual(38);
  });

  for (const file of files) {
    it(`renders upstream v1.0 example: ${file}`, async () => {
      const raw = JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf8'));
      const rawMsgs = Array.isArray(raw) ? raw : Array.isArray(raw.messages) ? raw.messages : [raw];
      const processor = new MessageProcessor<ReactCatalogComponent>([luminaReactCatalog]);

      processLuminaMessages(processor, rawMsgs, { remapBasicCatalogToLumina: true });

      const surfaces = Array.from(processor.model.surfacesMap.values());
      expect(surfaces.length).toBeGreaterThan(0);

      const { container } = render(
        <LuminaProvider theme="light" viewport="desktop">
          {surfaces.map((s) => (
            <LuminaSurface key={s.id} surface={s} />
          ))}
        </LuminaProvider>,
      );

      await waitFor(() => {
        expect(container.querySelector('.lumina-surface')?.innerHTML.length).toBeGreaterThan(0);
      });
    });
  }
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { Catalog } from '@a2ui/web_core';
import {
  A2uiGenerator,
  CatalogConfig,
  DirectJsonFormatFactory,
} from '@a2ui/agent';
import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogJsonPath = path.resolve(__dirname, '../../../packages/schema/catalog.json');

let cachedGenerator: A2uiGenerator | null = null;

export function getLuminaGenerator(): A2uiGenerator {
  if (!cachedGenerator) {
    const raw = JSON.parse(fs.readFileSync(catalogJsonPath, 'utf8'));
    const catalog = Catalog.fromJson(raw);
    cachedGenerator = new A2uiGenerator(
      [new CatalogConfig(catalog)],
      undefined,
      new DirectJsonFormatFactory(),
    );
  }
  return cachedGenerator;
}

export interface GeminiGenerationResult {
  text: string;
  a2uiMessages: Record<string, unknown>[];
}

export async function generateWithGemini(options: {
  apiKey: string;
  model?: string;
  query: string;
  actionName?: string;
  actionContext?: Record<string, unknown>;
  supportedCatalogIds: string[];
}): Promise<GeminiGenerationResult> {
  const generator = getLuminaGenerator();
  const catalogIds =
    options.supportedCatalogIds.length > 0
      ? options.supportedCatalogIds
      : [LUMINA_V1_CATALOG_ID];
  const processor = generator.createProcessor({
    '1.0': { supportedCatalogIds: catalogIds },
  });

  const systemInstruction = [
    'You are Lumina, an intelligent agentic UI assistant inspired by ChatGPT and Apple Human Interface Guidelines.',
    'Always reply with a brief 1-sentence human summary followed by a valid A2UI v1.0 JSON array using the Lumina catalog.',
    `Use catalogId "${LUMINA_V1_CATALOG_ID}" and version "1.0".`,
    'Prefer rich semantic components: ThoughtTrace, StepTimeline, StatMetric, Grid, Chart, DataTable, ComparisonMatrix, ApprovalCard, KeyValueList, SourceList, CodeBlock, DiffViewer, ArtifactCard, and FollowUpSuggestions.',
    processor.promptSnippet,
  ].join('\n\n');

  const ai = new GoogleGenAI({ apiKey: options.apiKey });
  const model = options.model ?? process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';

  const userPrompt = options.actionName
    ? `The user triggered UI action "${options.actionName}" with context: ${JSON.stringify(options.actionContext ?? {})}. User query note: ${options.query}`
    : options.query;

  let lastError = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? userPrompt
        : `${userPrompt}\n\nYour previous A2UI v1.0 output failed schema validation with:\n${lastError}\nReturn a corrected A2UI v1.0 JSON array.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction },
    });

    const rawText = response.text ?? '';
    try {
      const parts = processor.parseResponse(rawText);
      const textParts: string[] = [];
      const a2uiMessages: Record<string, unknown>[] = [];
      for (const part of parts) {
        if ('text' in part && typeof part.text === 'string' && part.text.trim()) {
          textParts.push(part.text.trim());
        }
        if ('a2uiMessages' in part && Array.isArray(part.a2uiMessages)) {
          for (const msg of part.a2uiMessages) {
            a2uiMessages.push(msg as Record<string, unknown>);
          }
        }
      }
      if (a2uiMessages.length > 0) {
        return {
          text: textParts.join('\n') || 'Here is your interactive Lumina surface.',
          a2uiMessages,
        };
      }
      lastError = 'Response did not contain any valid A2UI v1.0 messages.';
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  throw new Error(`Gemini failed to produce valid A2UI v1.0 output: ${lastError}`);
}

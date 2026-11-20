import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, dynString, spec } from '../../protocol/index.js';

export const CodeBlockPropsSchema = z
  .object({
    code: dynString('Source code, query, or log text to display.'),
    language: z.string().default('text').optional(),
    filename: dynString('Optional filename or snippet title.').optional(),
    showLineNumbers: z.boolean().default(true).optional(),
    highlightLines: z.array(z.number().int().min(1)).optional(),
    maxHeight: z.number().min(100).max(1200).default(420).optional(),
    actionLabel: dynString('Optional header action button label (e.g., "Run Query").').optional(),
    action: actionRef('Optional action dispatched when header action button is clicked.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Syntax-highlighted code block with line numbers and one-click copy.')
  .strict();

export type CodeBlockProps = z.infer<typeof CodeBlockPropsSchema>;

export const CodeBlockApi = {
  name: 'CodeBlock',
  schema: spec(CodeBlockPropsSchema),
} satisfies ComponentApi;

export const CODE_BLOCK_ALLOWED_CHILDREN = 'none' as const;

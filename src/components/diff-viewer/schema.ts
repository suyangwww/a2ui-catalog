import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, dynString, spec } from '../../protocol/index.js';

export const DiffViewerPropsSchema = z
  .object({
    before: dynString('Original content before proposed edits.'),
    after: dynString('Proposed updated content.'),
    filename: dynString('Optional file path or document name.').optional(),
    language: z.string().default('text').optional(),
    viewMode: z.enum(['unified', 'split']).default('unified').optional(),
    acceptAction: actionRef('Optional action to accept the proposed diff.').optional(),
    rejectAction: actionRef('Optional action to reject the proposed diff.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Unified or split patch viewer for code, config, and text revisions.')
  .strict();

export type DiffViewerProps = z.infer<typeof DiffViewerPropsSchema>;

export const DiffViewerApi = {
  name: 'DiffViewer',
  schema: spec(DiffViewerPropsSchema),
} satisfies ComponentApi;

export const DIFF_VIEWER_ALLOWED_CHILDREN = 'none' as const;

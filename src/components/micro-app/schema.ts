import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const MicroAppPropsSchema = z
  .object({
    title: dynString('Application header title (e.g., "PIXEL PALACE" or "DRUM / LAB 01").'),
    subtitle: dynString('Optional subtitle or instructions.').optional(),
    badge: dynString('Optional edition or status badge (e.g., "1989 EDITION" or "READY").').optional(),
    preset: z
      .enum(['retro-arcade', 'drum-sequencer', 'customHtml'])
      .default('retro-arcade')
      .describe(
        'Built-in playable interactive experience or isolated sandboxed customHtml escape hatch.',
      )
      .optional(),
    defaultGame: z
      .enum(['snake', 'breakout', 'pong'])
      .default('snake')
      .describe('Initial game cartridge when preset is retro-arcade.')
      .optional(),
    html: z
      .string()
      .describe(
        'Self-contained HTML/CSS/JS document rendered inside a sandbox="allow-scripts" iframe without same-origin access when preset is customHtml.',
      )
      .optional(),
    height: z.number().min(220).max(780).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Safe, theme-aware playable micro-application Component for retro games, WebAudio sequencers, and sandboxed canvases.',
  )
  .strict();

export type MicroAppProps = z.infer<typeof MicroAppPropsSchema>;

export const MicroAppApi = {
  name: 'MicroApp',
  schema: spec(MicroAppPropsSchema),
} satisfies ComponentApi;

export const MICRO_APP_ALLOWED_CHILDREN = 'none' as const;

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const MicroAppPropsSchema = z
  .object({
    title: dynString('Sandbox header title.'),
    subtitle: dynString('Optional subtitle or interaction hint.').optional(),
    badge: dynString('Optional status or runtime badge pill.').optional(),
    html: dynString(
      'Self-contained HTML/CSS/JS document rendered inside a sandbox="allow-scripts" iframe without same-origin access and with CSP blocking network egress.',
    ),
    height: z.number().min(180).max(860).default(420).optional(),
    expandable: z.boolean().default(true).optional(),
    chromeless: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Security-hardened, theme-synchronized HTML/Canvas/WebAudio sandbox Component for interactive simulations, synthesizers, and playable canvases.',
  )
  .strict();

export type MicroAppProps = z.infer<typeof MicroAppPropsSchema>;

export const MicroAppApi = {
  name: 'MicroApp',
  schema: spec(MicroAppPropsSchema),
} satisfies ComponentApi;

export const MICRO_APP_ALLOWED_CHILDREN = 'none' as const;

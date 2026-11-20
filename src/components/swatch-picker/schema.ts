import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  checksField,
  dynString,
  spec,
} from '../../protocol/index.js';

export const SwatchPickerPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('Optional palette heading (e.g., "Color direction" or "The palette").').optional(),
    value: dynString('Two-way bound selected swatch value.'),
    swatches: z
      .array(
        spec(
          z.object({
            value: z.string().describe('Stable swatch identifier.'),
            label: dynString('Color or material name (e.g., "Olive", "Sand").'),
            hex: z.string().describe('CSS hex color string (e.g., "#5E6647").'),
            subtitle: dynString('Optional finish or tone note.').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(2)
      .max(12)
      .describe('Selectable color or finish swatches.'),
    variant: z.enum(['circle', 'card']).default('circle').optional(),
    size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Tactile color and material palette selector with luminance-aware contrast checkmarks.')
  .strict();

export type SwatchPickerProps = z.infer<typeof SwatchPickerPropsSchema>;

export const SwatchPickerApi = {
  name: 'SwatchPicker',
  schema: spec(SwatchPickerPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const SWATCH_PICKER_ALLOWED_CHILDREN = 'none' as const;

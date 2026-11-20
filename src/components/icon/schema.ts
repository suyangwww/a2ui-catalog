import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  ALL_ICON_NAMES,
  DataBindingSchema,
  WeightSchema,
  dynString,
  spec,
} from '../../protocol/index.js';

export const IconPropsSchema = z
  .object({
    name: z
      .union([
        z.enum(ALL_ICON_NAMES),
        spec(
          z.object({
            svgPath: dynString('Custom SVG path d attribute (24x24 viewBox).'),
          }),
          { closure: 'additionalProperties' },
        ),
        DataBindingSchema.describe('REF:#/$defs/DataBinding'),
      ])
      .describe('Standard icon name, custom svgPath, or data binding.'),
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).default('md').optional(),
    tone: z
      .enum(['inherit', 'primary', 'secondary', 'accent', 'success', 'warning', 'critical'])
      .default('inherit')
      .optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Crisp 1.75px-stroke vector icon.')
  .strict();

export type IconProps = z.infer<typeof IconPropsSchema>;

export const IconApi = {
  name: 'Icon',
  schema: spec(IconPropsSchema),
} satisfies ComponentApi;

export const ICON_ALLOWED_CHILDREN = 'none' as const;

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, checksField, dynNumber, dynString, spec } from '../../protocol/index.js';

export const SliderPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('Optional slider label.').optional(),
    min: z.number().default(0).optional(),
    max: z.number().describe('Maximum slider value.'),
    value: dynNumber('Two-way bound numeric value.'),
    steps: z.number().int().min(1).optional(),
    unit: dynString('Optional display unit suffix (e.g. "%", "USD", "GB").').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Tactile range slider with filled active track and tabular readout.')
  .strict();

export type SliderProps = z.infer<typeof SliderPropsSchema>;

export const SliderApi = {
  name: 'Slider',
  schema: spec(SliderPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const SLIDER_ALLOWED_CHILDREN = 'none' as const;

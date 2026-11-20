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
    step: z.number().positive().describe('Explicit numeric step increment (e.g. 25, 5, 0.5).').optional(),
    steps: z.number().int().min(1).optional(),
    valuePrefix: dynString('Optional prefix rendered immediately before the numeric readout (e.g. "$").').optional(),
    unit: dynString('Optional display unit suffix (e.g. "%", "years", "USD", "GB").').optional(),
    marks: z
      .array(
        spec(
          z.object({
            value: z.number().describe('Numeric position on the slider track.'),
            label: dynString('Label rendered beneath the tick mark.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .max(8)
      .describe('Optional scale tick labels beneath the slider track.')
      .optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Tactile range slider with filled active track, scale marks, and tabular readout.')
  .strict();

export type SliderProps = z.infer<typeof SliderPropsSchema>;

export const SliderApi = {
  name: 'Slider',
  schema: spec(SliderPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const SLIDER_ALLOWED_CHILDREN = 'none' as const;

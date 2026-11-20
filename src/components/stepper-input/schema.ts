import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, checksField, dynNumber, dynString, spec } from '../../protocol/index.js';

export const StepperInputPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('Label describing the quantity being adjusted.'),
    value: dynNumber('Two-way bound numeric quantity.'),
    min: z.number().default(0).optional(),
    max: z.number().default(99).optional(),
    step: z.number().default(1).optional(),
    description: dynString('Optional helper subtitle (e.g., "Ages 12+").').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Compact minus/plus numeric counter with animated odometer value transition.')
  .strict();

export type StepperInputProps = z.infer<typeof StepperInputPropsSchema>;

export const StepperInputApi = {
  name: 'StepperInput',
  schema: spec(StepperInputPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const STEPPER_INPUT_ALLOWED_CHILDREN = 'none' as const;

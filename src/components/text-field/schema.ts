import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, checksField, dynBoolean, dynString, spec } from '../../protocol/index.js';

export const TextFieldPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('The text label for the input field.'),
    value: dynString('Two-way bound input value.').optional(),
    placeholder: dynString('Optional placeholder text.').optional(),
    helperText: dynString('Optional helper text displayed beneath the field.').optional(),
    variant: z
      .enum(['shortText', 'longText', 'number', 'obscured', 'email', 'search', 'url'])
      .default('shortText')
      .optional(),
    prefixIcon: z.string().optional(),
    clearable: z.boolean().default(false).optional(),
    disabled: dynBoolean('Optional disabled state.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Clean single-line or auto-growing multiline text input with reactive validation.')
  .strict();

export type TextFieldProps = z.infer<typeof TextFieldPropsSchema>;

export const TextFieldApi = {
  name: 'TextField',
  schema: spec(TextFieldPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const TEXT_FIELD_ALLOWED_CHILDREN = 'none' as const;

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, checksField, dynBoolean, dynString, spec } from '../../protocol/index.js';

export const CheckBoxPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('The text displayed next to the checkbox.'),
    value: dynBoolean('Two-way bound checked boolean state.'),
    description: dynString('Optional helper text beneath the label.').optional(),
    disabled: dynBoolean('Optional disabled state.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Accessible checkbox with animated checkmark draw.')
  .strict();

export type CheckBoxProps = z.infer<typeof CheckBoxPropsSchema>;

export const CheckBoxApi = {
  name: 'CheckBox',
  schema: spec(CheckBoxPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const CHECK_BOX_ALLOWED_CHILDREN = 'none' as const;

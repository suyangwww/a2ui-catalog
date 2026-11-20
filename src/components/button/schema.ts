import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  actionRef,
  checksField,
  childRef,
  dynBoolean,
  dynString,
  spec,
} from '../../protocol/index.js';

export const ButtonPropsSchema = z
  .object({
    checks: checksField,
    child: childRef('Optional child component ID (Basic Catalog compatible).').optional(),
    label: dynString('Direct button label (preferred for concise agent surfaces).').optional(),
    variant: z
      .enum(['default', 'primary', 'secondary', 'tonal', 'borderless', 'ghost', 'danger'])
      .default('default')
      .optional(),
    size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
    icon: z.string().optional(),
    trailingIcon: z.string().optional(),
    fullWidth: z.boolean().default(false).optional(),
    disabled: dynBoolean('Optional disabled state.').optional(),
    action: actionRef('Action triggered when the button is pressed.'),
    weight: WeightSchema.optional(),
  })
  .describe('Tactile action button supporting both concise label+icon and child composition.')
  .strict();

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

export const ButtonApi = {
  name: 'Button',
  schema: spec(ButtonPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const BUTTON_ALLOWED_CHILDREN = ['Text', 'Row', 'Icon'] as const;

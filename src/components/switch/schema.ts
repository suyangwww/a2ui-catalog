import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  actionRef,
  checksField,
  dynBoolean,
  dynString,
  spec,
} from '../../protocol/index.js';

export const SwitchPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('Setting label next to the toggle switch.'),
    value: dynBoolean('Two-way bound boolean toggle state.'),
    description: dynString('Optional supporting description.').optional(),
    disabled: dynBoolean('Optional disabled state.').optional(),
    action: actionRef('Optional side-effect action dispatched after toggling.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('iOS-style spring toggle switch for instant preferences and opt-ins.')
  .strict();

export type SwitchProps = z.infer<typeof SwitchPropsSchema>;

export const SwitchApi = {
  name: 'Switch',
  schema: spec(SwitchPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const SWITCH_ALLOWED_CHILDREN = 'none' as const;

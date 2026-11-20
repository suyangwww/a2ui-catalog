import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  actionRef,
  checksField,
  childRef,
  dynString,
  spec,
} from '../../protocol/index.js';

export const ApprovalCardPropsSchema = z
  .object({
    checks: checksField,
    title: dynString('Headline of the action requiring user approval.'),
    description: dynString('Clear explanation of the impact if approved.').optional(),
    riskLevel: z.enum(['low', 'medium', 'high']).default('medium').optional(),
    state: dynString("Reactive state: 'pending', 'approved', or 'rejected'.").optional(),
    details: childRef('Optional detail child (e.g., KeyValueList, DiffViewer, or CheckBox).').optional(),
    approveLabel: dynString('Label for the primary approval button.').optional(),
    approveAction: actionRef('Action dispatched when the user approves.'),
    rejectLabel: dynString('Label for the decline/cancel button.').optional(),
    rejectAction: actionRef('Optional action dispatched when the user declines.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Human-in-the-loop confirmation gate for high-impact or financial actions.')
  .strict();

export type ApprovalCardProps = z.infer<typeof ApprovalCardPropsSchema>;

export const ApprovalCardApi = {
  name: 'ApprovalCard',
  schema: spec(ApprovalCardPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const APPROVAL_CARD_ALLOWED_CHILDREN = 'any' as const;

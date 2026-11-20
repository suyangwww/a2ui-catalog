import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childRef, dynBoolean, dynString, spec } from '../../protocol/index.js';

export const ModalPropsSchema = z
  .object({
    trigger: childRef('Trigger component (such as a Button) that opens the modal.'),
    content: childRef('Content component displayed inside the modal or mobile bottom sheet.'),
    title: dynString('Accessible modal header title.').optional(),
    description: dynString('Accessible modal header description.').optional(),
    open: dynBoolean('Optional controlled open state bound to the data model.').optional(),
    size: z.enum(['sm', 'md', 'lg', 'fullscreen']).default('md').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Frosted dialog on desktop that adapts to a draggable iOS bottom sheet on mobile.')
  .strict();

export type ModalProps = z.infer<typeof ModalPropsSchema>;

export const ModalApi = {
  name: 'Modal',
  schema: spec(ModalPropsSchema),
} satisfies ComponentApi;

export const MODAL_ALLOWED_CHILDREN = 'any' as const;

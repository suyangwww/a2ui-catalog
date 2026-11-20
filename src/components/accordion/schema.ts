import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childRef, dynString, spec } from '../../protocol/index.js';

export const AccordionPropsSchema = z
  .object({
    items: z
      .array(
        spec(
          z.object({
            id: z.string(),
            title: dynString('Section header title.'),
            subtitle: dynString('Optional secondary summary shown in the header.').optional(),
            child: childRef('Child component rendered inside the expanded section.'),
            icon: z.string().optional(),
            defaultOpen: z.boolean().default(false).optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Collapsible disclosure sections.'),
    allowMultiple: z.boolean().default(false).optional(),
    variant: z.enum(['grouped', 'separated', 'ghost']).default('grouped').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Progressive-disclosure collapsible sections.')
  .strict();

export type AccordionProps = z.infer<typeof AccordionPropsSchema>;

export const AccordionApi = {
  name: 'Accordion',
  schema: spec(AccordionPropsSchema),
} satisfies ComponentApi;

export const ACCORDION_ALLOWED_CHILDREN = 'any' as const;

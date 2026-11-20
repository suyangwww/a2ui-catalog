import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childRef, dynString, spec } from '../../protocol/index.js';

export const TabsPropsSchema = z
  .object({
    tabs: z
      .array(
        spec(
          z.object({
            title: dynString('The tab title.'),
            child: childRef('The ID of the child component for this tab panel.'),
            icon: z.string().optional(),
            badge: dynString('Optional compact count or status pill on the tab.').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Ordered list of tab definitions.'),
    defaultIndex: z.number().int().min(0).default(0).optional(),
    selectedValue: dynString('Optional two-way bound active tab key or index.').optional(),
    variant: z.enum(['segmented', 'underline']).default('segmented').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Multi-view switcher with spring-animated sliding pill indicator.')
  .strict();

export type TabsProps = z.infer<typeof TabsPropsSchema>;

export const TabsApi = {
  name: 'Tabs',
  schema: spec(TabsPropsSchema),
} satisfies ComponentApi;

export const TABS_ALLOWED_CHILDREN = 'any' as const;

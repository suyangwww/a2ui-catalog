import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CHECKLIST_CARD_ALLOWED_CHILDREN,
  ChecklistCardApi,
  ChecklistCardPropsSchema,
  type ChecklistCardProps,
} from './schema.js';
import { ChecklistCardRenderer } from './renderer.js';

export const checklistCardComponent = defineCatalogComponent<
  typeof ChecklistCardPropsSchema,
  React.ReactNode
>({
  id: 'ChecklistCard',
  slug: 'checklist-card',
  group: 'Agent Thinking & Approvals',
  api: ChecklistCardApi,
  propsSchema: ChecklistCardPropsSchema,
  allowedChildren: CHECKLIST_CARD_ALLOWED_CHILDREN,
  renderer: ChecklistCardRenderer,
});

export { ChecklistCardApi, type ChecklistCardProps };

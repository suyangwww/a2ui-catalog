import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  APPROVAL_CARD_ALLOWED_CHILDREN,
  ApprovalCardApi,
  ApprovalCardPropsSchema,
  type ApprovalCardProps,
} from './schema.js';
import { ApprovalCardRenderer } from './renderer.js';

export const approvalCardComponent = defineCatalogComponent<typeof ApprovalCardPropsSchema, React.ReactNode>({
  id: 'ApprovalCard',
  slug: 'approval-card',
  group: 'Agent Thinking & Approvals',
  api: ApprovalCardApi,
  propsSchema: ApprovalCardPropsSchema,
  allowedChildren: APPROVAL_CARD_ALLOWED_CHILDREN,
  renderer: ApprovalCardRenderer,
});

export { ApprovalCardApi, type ApprovalCardProps };

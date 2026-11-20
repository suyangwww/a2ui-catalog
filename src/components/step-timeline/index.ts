import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  STEP_TIMELINE_ALLOWED_CHILDREN,
  StepTimelineApi,
  StepTimelinePropsSchema,
  type StepTimelineProps,
} from './schema.js';
import { StepTimelineRenderer } from './renderer.js';

export const stepTimelineComponent = defineCatalogComponent<typeof StepTimelinePropsSchema, React.ReactNode>({
  id: 'StepTimeline',
  slug: 'step-timeline',
  group: 'Agent Thinking & Approvals',
  api: StepTimelineApi,
  propsSchema: StepTimelinePropsSchema,
  allowedChildren: STEP_TIMELINE_ALLOWED_CHILDREN,
  renderer: StepTimelineRenderer,
});

export { StepTimelineApi, type StepTimelineProps };

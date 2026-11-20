import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  THOUGHT_TRACE_ALLOWED_CHILDREN,
  ThoughtTraceApi,
  ThoughtTracePropsSchema,
  type ThoughtTraceProps,
} from './schema.js';
import { ThoughtTraceRenderer } from './renderer.js';

export const thoughtTraceComponent = defineCatalogComponent<typeof ThoughtTracePropsSchema, React.ReactNode>({
  id: 'ThoughtTrace',
  slug: 'thought-trace',
  group: 'Agent Thinking & Approvals',
  api: ThoughtTraceApi,
  propsSchema: ThoughtTracePropsSchema,
  allowedChildren: THOUGHT_TRACE_ALLOWED_CHILDREN,
  renderer: ThoughtTraceRenderer,
});

export { ThoughtTraceApi, type ThoughtTraceProps };

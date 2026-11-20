import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CODE_BLOCK_ALLOWED_CHILDREN,
  CodeBlockApi,
  CodeBlockPropsSchema,
  type CodeBlockProps,
} from './schema.js';
import { CodeBlockRenderer } from './renderer.js';

export const codeBlockComponent = defineCatalogComponent<typeof CodeBlockPropsSchema, React.ReactNode>({
  id: 'CodeBlock',
  slug: 'code-block',
  group: 'Sources, Code & Documents',
  api: CodeBlockApi,
  propsSchema: CodeBlockPropsSchema,
  allowedChildren: CODE_BLOCK_ALLOWED_CHILDREN,
  renderer: CodeBlockRenderer,
});

export { CodeBlockApi, type CodeBlockProps };

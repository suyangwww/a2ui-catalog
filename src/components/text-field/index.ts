import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  TEXT_FIELD_ALLOWED_CHILDREN,
  TextFieldApi,
  TextFieldPropsSchema,
  type TextFieldProps,
} from './schema.js';
import { TextFieldRenderer } from './renderer.js';

export const textFieldComponent = defineCatalogComponent<typeof TextFieldPropsSchema, React.ReactNode>({
  id: 'TextField',
  slug: 'text-field',
  group: 'Buttons & Form Inputs',
  api: TextFieldApi,
  propsSchema: TextFieldPropsSchema,
  allowedChildren: TEXT_FIELD_ALLOWED_CHILDREN,
  renderer: TextFieldRenderer,
});

export { TextFieldApi, type TextFieldProps };

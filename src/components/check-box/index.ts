import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CHECK_BOX_ALLOWED_CHILDREN,
  CheckBoxApi,
  CheckBoxPropsSchema,
  type CheckBoxProps,
} from './schema.js';
import { CheckBoxRenderer } from './renderer.js';

export const checkBoxComponent = defineCatalogComponent<typeof CheckBoxPropsSchema, React.ReactNode>({
  id: 'CheckBox',
  slug: 'check-box',
  group: 'Buttons & Form Inputs',
  api: CheckBoxApi,
  propsSchema: CheckBoxPropsSchema,
  allowedChildren: CHECK_BOX_ALLOWED_CHILDREN,
  renderer: CheckBoxRenderer,
});

export { CheckBoxApi, type CheckBoxProps };

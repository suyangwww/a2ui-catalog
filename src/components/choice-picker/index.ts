import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CHOICE_PICKER_ALLOWED_CHILDREN,
  ChoicePickerApi,
  ChoicePickerPropsSchema,
  type ChoicePickerProps,
} from './schema.js';
import { ChoicePickerRenderer } from './renderer.js';

export const choicePickerComponent = defineCatalogComponent<typeof ChoicePickerPropsSchema, React.ReactNode>({
  id: 'ChoicePicker',
  slug: 'choice-picker',
  group: 'Buttons & Form Inputs',
  api: ChoicePickerApi,
  propsSchema: ChoicePickerPropsSchema,
  allowedChildren: CHOICE_PICKER_ALLOWED_CHILDREN,
  renderer: ChoicePickerRenderer,
});

export { ChoicePickerApi, type ChoicePickerProps };

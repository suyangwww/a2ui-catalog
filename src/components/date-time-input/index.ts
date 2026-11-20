import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  DATE_TIME_INPUT_ALLOWED_CHILDREN,
  DateTimeInputApi,
  DateTimeInputPropsSchema,
  type DateTimeInputProps,
} from './schema.js';
import { DateTimeInputRenderer } from './renderer.js';

export const dateTimeInputComponent = defineCatalogComponent<typeof DateTimeInputPropsSchema, React.ReactNode>({
  id: 'DateTimeInput',
  slug: 'date-time-input',
  group: 'Buttons & Form Inputs',
  api: DateTimeInputApi,
  propsSchema: DateTimeInputPropsSchema,
  allowedChildren: DATE_TIME_INPUT_ALLOWED_CHILDREN,
  renderer: DateTimeInputRenderer,
});

export { DateTimeInputApi, type DateTimeInputProps };

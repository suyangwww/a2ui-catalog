import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  STEPPER_INPUT_ALLOWED_CHILDREN,
  StepperInputApi,
  StepperInputPropsSchema,
  type StepperInputProps,
} from './schema.js';
import { StepperInputRenderer } from './renderer.js';

export const stepperInputComponent = defineCatalogComponent<typeof StepperInputPropsSchema, React.ReactNode>({
  id: 'StepperInput',
  slug: 'stepper-input',
  group: 'Buttons & Form Inputs',
  api: StepperInputApi,
  propsSchema: StepperInputPropsSchema,
  allowedChildren: STEPPER_INPUT_ALLOWED_CHILDREN,
  renderer: StepperInputRenderer,
});

export { StepperInputApi, type StepperInputProps };

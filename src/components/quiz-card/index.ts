import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  QUIZ_CARD_ALLOWED_CHILDREN,
  QuizCardApi,
  QuizCardPropsSchema,
  type QuizCardProps,
} from './schema.js';
import { QuizCardRenderer } from './renderer.js';

export const quizCardComponent = defineCatalogComponent<
  typeof QuizCardPropsSchema,
  React.ReactNode
>({
  id: 'QuizCard',
  slug: 'quiz-card',
  group: 'Numbers, Charts & Next Steps',
  api: QuizCardApi,
  propsSchema: QuizCardPropsSchema,
  allowedChildren: QUIZ_CARD_ALLOWED_CHILDREN,
  renderer: QuizCardRenderer,
});

export { QuizCardApi, type QuizCardProps };

import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  FOLLOW_UP_SUGGESTIONS_ALLOWED_CHILDREN,
  FollowUpSuggestionsApi,
  FollowUpSuggestionsPropsSchema,
  type FollowUpSuggestionsProps,
} from './schema.js';
import { FollowUpSuggestionsRenderer } from './renderer.js';

export const followUpSuggestionsComponent = defineCatalogComponent<typeof FollowUpSuggestionsPropsSchema, React.ReactNode>({
  id: 'FollowUpSuggestions',
  slug: 'follow-up-suggestions',
  group: 'Numbers, Charts & Next Steps',
  api: FollowUpSuggestionsApi,
  propsSchema: FollowUpSuggestionsPropsSchema,
  allowedChildren: FOLLOW_UP_SUGGESTIONS_ALLOWED_CHILDREN,
  renderer: FollowUpSuggestionsRenderer,
});

export { FollowUpSuggestionsApi, type FollowUpSuggestionsProps };

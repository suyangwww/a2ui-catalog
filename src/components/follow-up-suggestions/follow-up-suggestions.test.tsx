import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { followUpSuggestionsComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: follow-up-suggestions', () => {
  it('validates examples.json against FollowUpSuggestionsPropsSchema and rejects unknown properties', () => {
    expect(followUpSuggestionsComponent.id).toBe('FollowUpSuggestions');
    expect(followUpSuggestionsComponent.slug).toBe('follow-up-suggestions');
    for (const example of examples) {
      const result = followUpSuggestionsComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      followUpSuggestionsComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts FollowUpSuggestions through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = followUpSuggestionsComponent.renderer;
    const { container } = render(
      <div data-testid="seam-host">
        <SeamRenderer
          props={firstProps}
          buildChild={(childId) => <span data-child-id={childId}>{childId}</span>}
        />
      </div>,
    );
    expect(container.querySelector('[data-testid="seam-host"]')).toBeTruthy();
  });
});

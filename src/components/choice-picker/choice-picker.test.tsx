import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { choicePickerComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: choice-picker', () => {
  it('validates examples.json against ChoicePickerPropsSchema and rejects unknown properties', () => {
    expect(choicePickerComponent.id).toBe('ChoicePicker');
    expect(choicePickerComponent.slug).toBe('choice-picker');
    for (const example of examples) {
      const result = choicePickerComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      choicePickerComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts ChoicePicker through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = choicePickerComponent.renderer;
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

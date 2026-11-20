import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { textFieldComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: text-field', () => {
  it('validates examples.json against TextFieldPropsSchema and rejects unknown properties', () => {
    expect(textFieldComponent.id).toBe('TextField');
    expect(textFieldComponent.slug).toBe('text-field');
    for (const example of examples) {
      const result = textFieldComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      textFieldComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts TextField through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = textFieldComponent.renderer;
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

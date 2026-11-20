import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { checkBoxComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: check-box', () => {
  it('validates examples.json against CheckBoxPropsSchema and rejects unknown properties', () => {
    expect(checkBoxComponent.id).toBe('CheckBox');
    expect(checkBoxComponent.slug).toBe('check-box');
    for (const example of examples) {
      const result = checkBoxComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      checkBoxComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts CheckBox through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = checkBoxComponent.renderer;
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

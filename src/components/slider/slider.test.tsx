import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { sliderComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: slider', () => {
  it('validates examples.json against SliderPropsSchema and rejects unknown properties', () => {
    expect(sliderComponent.id).toBe('Slider');
    expect(sliderComponent.slug).toBe('slider');
    for (const example of examples) {
      const result = sliderComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      sliderComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts Slider through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = sliderComponent.renderer;
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

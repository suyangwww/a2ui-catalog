import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { proportionBarComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: proportion-bar', () => {
  it('validates examples.json against ProportionBarPropsSchema and rejects unknown properties', () => {
    expect(proportionBarComponent.id).toBe('ProportionBar');
    expect(proportionBarComponent.slug).toBe('proportion-bar');
    for (const example of examples) {
      const result = proportionBarComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      proportionBarComponent.propsSchema.safeParse({ ...firstProps, __unknown: true }).success,
    ).toBe(false);
  });

  it('renders swatched split statistics cleanly via its seam renderer', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = proportionBarComponent.renderer;
    const { container } = render(
      <SeamRenderer props={firstProps} buildChild={(id) => <span>{id}</span>} />,
    );
    expect(container.textContent).toContain('Your contributions');
    expect(container.textContent).toContain('$180,000');
  });
});

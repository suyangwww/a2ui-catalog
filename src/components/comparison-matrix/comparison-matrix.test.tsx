import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { comparisonMatrixComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: comparison-matrix', () => {
  it('validates examples.json against ComparisonMatrixPropsSchema and rejects unknown properties', () => {
    expect(comparisonMatrixComponent.id).toBe('ComparisonMatrix');
    expect(comparisonMatrixComponent.slug).toBe('comparison-matrix');
    for (const example of examples) {
      const result = comparisonMatrixComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      comparisonMatrixComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts ComparisonMatrix through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = comparisonMatrixComponent.renderer;
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

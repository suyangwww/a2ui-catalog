import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { progressIndicatorComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: progress-indicator', () => {
  it('validates examples.json against ProgressIndicatorPropsSchema and rejects unknown properties', () => {
    expect(progressIndicatorComponent.id).toBe('ProgressIndicator');
    expect(progressIndicatorComponent.slug).toBe('progress-indicator');
    for (const example of examples) {
      const result = progressIndicatorComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      progressIndicatorComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts ProgressIndicator through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = progressIndicatorComponent.renderer;
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

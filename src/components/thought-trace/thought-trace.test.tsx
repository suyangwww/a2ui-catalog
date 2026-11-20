import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { thoughtTraceComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: thought-trace', () => {
  it('validates examples.json against ThoughtTracePropsSchema and rejects unknown properties', () => {
    expect(thoughtTraceComponent.id).toBe('ThoughtTrace');
    expect(thoughtTraceComponent.slug).toBe('thought-trace');
    for (const example of examples) {
      const result = thoughtTraceComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      thoughtTraceComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts ThoughtTrace through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = thoughtTraceComponent.renderer;
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

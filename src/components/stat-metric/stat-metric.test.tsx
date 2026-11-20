import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { statMetricComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: stat-metric', () => {
  it('validates examples.json against StatMetricPropsSchema and rejects unknown properties', () => {
    expect(statMetricComponent.id).toBe('StatMetric');
    expect(statMetricComponent.slug).toBe('stat-metric');
    for (const example of examples) {
      const result = statMetricComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      statMetricComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts StatMetric through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = statMetricComponent.renderer;
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

import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { stepTimelineComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: step-timeline', () => {
  it('validates examples.json against StepTimelinePropsSchema and rejects unknown properties', () => {
    expect(stepTimelineComponent.id).toBe('StepTimeline');
    expect(stepTimelineComponent.slug).toBe('step-timeline');
    for (const example of examples) {
      const result = stepTimelineComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      stepTimelineComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts StepTimeline through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = stepTimelineComponent.renderer;
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

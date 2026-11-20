import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { stepperInputComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: stepper-input', () => {
  it('validates examples.json against StepperInputPropsSchema and rejects unknown properties', () => {
    expect(stepperInputComponent.id).toBe('StepperInput');
    expect(stepperInputComponent.slug).toBe('stepper-input');
    for (const example of examples) {
      const result = stepperInputComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      stepperInputComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts StepperInput through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = stepperInputComponent.renderer;
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

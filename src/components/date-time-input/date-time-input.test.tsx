import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { dateTimeInputComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: date-time-input', () => {
  it('validates examples.json against DateTimeInputPropsSchema and rejects unknown properties', () => {
    expect(dateTimeInputComponent.id).toBe('DateTimeInput');
    expect(dateTimeInputComponent.slug).toBe('date-time-input');
    for (const example of examples) {
      const result = dateTimeInputComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      dateTimeInputComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts DateTimeInput through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = dateTimeInputComponent.renderer;
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

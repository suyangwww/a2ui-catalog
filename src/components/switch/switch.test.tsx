import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { switchComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: switch', () => {
  it('validates examples.json against SwitchPropsSchema and rejects unknown properties', () => {
    expect(switchComponent.id).toBe('Switch');
    expect(switchComponent.slug).toBe('switch');
    for (const example of examples) {
      const result = switchComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      switchComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts Switch through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = switchComponent.renderer;
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

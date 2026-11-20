import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { statusBadgeComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: status-badge', () => {
  it('validates examples.json against StatusBadgePropsSchema and rejects unknown properties', () => {
    expect(statusBadgeComponent.id).toBe('StatusBadge');
    expect(statusBadgeComponent.slug).toBe('status-badge');
    for (const example of examples) {
      const result = statusBadgeComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      statusBadgeComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts StatusBadge through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = statusBadgeComponent.renderer;
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

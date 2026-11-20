import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { approvalCardComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: approval-card', () => {
  it('validates examples.json against ApprovalCardPropsSchema and rejects unknown properties', () => {
    expect(approvalCardComponent.id).toBe('ApprovalCard');
    expect(approvalCardComponent.slug).toBe('approval-card');
    for (const example of examples) {
      const result = approvalCardComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      approvalCardComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts ApprovalCard through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = approvalCardComponent.renderer;
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

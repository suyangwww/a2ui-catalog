import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { codeBlockComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: code-block', () => {
  it('validates examples.json against CodeBlockPropsSchema and rejects unknown properties', () => {
    expect(codeBlockComponent.id).toBe('CodeBlock');
    expect(codeBlockComponent.slug).toBe('code-block');
    for (const example of examples) {
      const result = codeBlockComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      codeBlockComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts CodeBlock through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = codeBlockComponent.renderer;
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

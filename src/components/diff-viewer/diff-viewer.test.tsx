import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { diffViewerComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: diff-viewer', () => {
  it('validates examples.json against DiffViewerPropsSchema and rejects unknown properties', () => {
    expect(diffViewerComponent.id).toBe('DiffViewer');
    expect(diffViewerComponent.slug).toBe('diff-viewer');
    for (const example of examples) {
      const result = diffViewerComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      diffViewerComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts DiffViewer through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = diffViewerComponent.renderer;
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

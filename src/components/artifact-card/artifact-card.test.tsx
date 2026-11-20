import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { artifactCardComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: artifact-card', () => {
  it('validates examples.json against ArtifactCardPropsSchema and rejects unknown properties', () => {
    expect(artifactCardComponent.id).toBe('ArtifactCard');
    expect(artifactCardComponent.slug).toBe('artifact-card');
    for (const example of examples) {
      const result = artifactCardComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      artifactCardComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts ArtifactCard through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = artifactCardComponent.renderer;
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

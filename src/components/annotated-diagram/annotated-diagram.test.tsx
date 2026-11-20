import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { annotatedDiagramComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: annotated-diagram', () => {
  it('validates examples.json against AnnotatedDiagramPropsSchema and rejects unknown properties', () => {
    expect(annotatedDiagramComponent.id).toBe('AnnotatedDiagram');
    expect(annotatedDiagramComponent.slug).toBe('annotated-diagram');
    for (const example of examples) {
      const result = annotatedDiagramComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      annotatedDiagramComponent.propsSchema.safeParse({ ...firstProps, __invalid: 1 }).success,
    ).toBe(false);
  });

  it('filters bicycle subsystems interactively via filter pills', () => {
    const firstProps = { ...(examples[0]?.props ?? {}), value: 'all' };
    const SeamRenderer = annotatedDiagramComponent.renderer;
    const { container, getByRole } = render(
      <SeamRenderer props={firstProps} buildChild={(id) => <span>{id}</span>} />,
    );
    expect(container.textContent).toContain('Seven ways to move');
    fireEvent.click(getByRole('tab', { name: 'Brakes' }));
    expect(container.textContent).toContain('Control at the rim');
  });
});

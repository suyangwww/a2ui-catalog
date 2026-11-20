import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { quizCardComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: quiz-card', () => {
  it('validates examples.json against QuizCardPropsSchema and rejects unknown properties', () => {
    expect(quizCardComponent.id).toBe('QuizCard');
    expect(quizCardComponent.slug).toBe('quiz-card');
    for (const example of examples) {
      const result = quizCardComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      quizCardComponent.propsSchema.safeParse({ ...firstProps, __extra: 1 }).success,
    ).toBe(false);
  });

  it('reveals answer verification and explanation when an option is selected', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = quizCardComponent.renderer;
    const { container, getByText } = render(
      <SeamRenderer props={firstProps} buildChild={(id) => <span>{id}</span>} />,
    );
    fireEvent.click(getByText('Jupiter'));
    expect(container.textContent).toContain('143,000 kilometers');
    expect(container.textContent).toContain('Score: 1 / 2');
  });
});

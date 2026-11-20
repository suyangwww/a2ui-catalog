import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { checklistCardComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: checklist-card', () => {
  it('validates examples.json against ChecklistCardPropsSchema and rejects unknown properties', () => {
    expect(checklistCardComponent.id).toBe('ChecklistCard');
    expect(checklistCardComponent.slug).toBe('checklist-card');
    for (const example of examples) {
      const result = checklistCardComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      checklistCardComponent.propsSchema.safeParse({ ...firstProps, __bad: 1 }).success,
    ).toBe(false);
  });

  it('toggles checklist items interactively via its seam renderer', () => {
    const SeamRenderer = checklistCardComponent.renderer;
    const { container, getByText } = render(
      <SeamRenderer
        props={{
          title: 'Cooking checklist',
          value: ['sat'],
          items: [
            { id: 'sat', time: 'Saturday', title: 'Prep ahead' },
            { id: '1230', time: '12:30 PM', title: 'Prepare the lamb' },
          ],
        }}
        buildChild={(id) => <span>{id}</span>}
      />,
    );
    expect(container.textContent).toContain('1 of 2');
    fireEvent.click(getByText('Prepare the lamb'));
    expect(container.textContent).toContain('2 of 2');
  });
});

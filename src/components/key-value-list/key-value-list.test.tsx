import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { keyValueListComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: key-value-list', () => {
  it('validates examples.json against KeyValueListPropsSchema and rejects unknown properties', () => {
    expect(keyValueListComponent.id).toBe('KeyValueList');
    expect(keyValueListComponent.slug).toBe('key-value-list');
    for (const example of examples) {
      const result = keyValueListComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      keyValueListComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts KeyValueList through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = keyValueListComponent.renderer;
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

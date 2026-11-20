import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { swatchPickerComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: swatch-picker', () => {
  it('validates examples.json against SwatchPickerPropsSchema and rejects unknown properties', () => {
    expect(swatchPickerComponent.id).toBe('SwatchPicker');
    expect(swatchPickerComponent.slug).toBe('swatch-picker');
    for (const example of examples) {
      const result = swatchPickerComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      swatchPickerComponent.propsSchema.safeParse({ ...firstProps, __extra: true }).success,
    ).toBe(false);
  });

  it('switches active swatch interactively via its seam renderer', () => {
    const SeamRenderer = swatchPickerComponent.renderer;
    const { getByRole } = render(
      <SeamRenderer
        props={{
          label: 'Color direction',
          value: 'olive',
          swatches: [
            { value: 'olive', label: 'Olive', hex: '#5E6647' },
            { value: 'sand', label: 'Sand', hex: '#D2C3A8' },
          ],
        }}
        buildChild={(id) => <span>{id}</span>}
      />,
    );
    const sandBtn = getByRole('radio', { name: 'Sand' });
    expect(sandBtn.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(sandBtn);
    expect(sandBtn.getAttribute('aria-checked')).toBe('true');
  });
});

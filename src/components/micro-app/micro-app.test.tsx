import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { microAppComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: micro-app', () => {
  it('validates examples.json against MicroAppPropsSchema and rejects unknown properties', () => {
    expect(microAppComponent.id).toBe('MicroApp');
    expect(microAppComponent.slug).toBe('micro-app');
    for (const example of examples) {
      const result = microAppComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      microAppComponent.propsSchema.safeParse({ ...firstProps, __extra: 1 }).success,
    ).toBe(false);
  });

  it('mounts a CSP-hardened sandbox="allow-scripts" iframe without allow-same-origin and supports reset', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = microAppComponent.renderer;
    const { container, getByLabelText } = render(
      <SeamRenderer props={firstProps} buildChild={(id) => <span>{id}</span>} />,
    );
    expect(container.textContent).toContain('Harmonic Superposition Lab');
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('sandbox')).toBe('allow-scripts');
    expect(iframe?.getAttribute('srcdoc')).toContain("default-src 'none'");
    fireEvent.click(getByLabelText('Reset Harmonic Superposition Lab'));
    expect(container.querySelector('iframe')).not.toBeNull();
  });
});

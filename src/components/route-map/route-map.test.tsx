import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { routeMapComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: route-map', () => {
  it('validates examples.json against RouteMapPropsSchema and rejects unknown properties', () => {
    expect(routeMapComponent.id).toBe('RouteMap');
    expect(routeMapComponent.slug).toBe('route-map');
    for (const example of examples) {
      const result = routeMapComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      routeMapComponent.propsSchema.safeParse({ ...firstProps, __extra: 'bad' }).success,
    ).toBe(false);
  });

  it('selects route stops interactively on pin click', () => {
    const firstProps = { ...(examples[0]?.props ?? {}), value: 'ginkakuji' };
    const SeamRenderer = routeMapComponent.renderer;
    const { container, getByRole } = render(
      <SeamRenderer props={firstProps} buildChild={(id) => <span>{id}</span>} />,
    );
    expect(container.textContent).toContain('Raked white-sand garden');
    fireEvent.click(getByRole('button', { name: '3. Honen-in Teahouse' }));
    expect(container.textContent).toContain('thatched moss gate');
  });
});

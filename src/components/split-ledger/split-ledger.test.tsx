import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { splitLedgerComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: split-ledger', () => {
  it('validates examples.json against SplitLedgerPropsSchema and rejects unknown properties', () => {
    expect(splitLedgerComponent.id).toBe('SplitLedger');
    expect(splitLedgerComponent.slug).toBe('split-ledger');
    for (const example of examples) {
      const result = splitLedgerComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      splitLedgerComponent.propsSchema.safeParse({ ...firstProps, __extra: 1 }).success,
    ).toBe(false);
  });

  it('computes itemized total, applies tip presets, and reveals cent-exact shares', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = splitLedgerComponent.renderer;
    const { container, getByText } = render(
      <SeamRenderer props={firstProps} buildChild={(id) => <span>{id}</span>} />,
    );
    expect(container.textContent).toContain('$199.18');
    fireEvent.click(getByText('10%'));
    expect(container.textContent).toContain('$217.58');
    fireEvent.click(getByText('Calculate split'));
    expect(container.textContent).toContain("Everyone's share");
  });
});

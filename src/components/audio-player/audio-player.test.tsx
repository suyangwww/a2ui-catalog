import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import examples from './examples.json' with { type: 'json' };
import { audioPlayerComponent } from './index.js';

afterEach(() => cleanup());

describe('component slice: audio-player', () => {
  it('validates examples.json against AudioPlayerPropsSchema and rejects unknown properties', () => {
    expect(audioPlayerComponent.id).toBe('AudioPlayer');
    expect(audioPlayerComponent.slug).toBe('audio-player');
    for (const example of examples) {
      const result = audioPlayerComponent.propsSchema.safeParse(example.props);
      expect(result.success).toBe(true);
    }
    const firstProps = examples[0]?.props ?? {};
    expect(
      audioPlayerComponent.propsSchema.safeParse({ ...firstProps, __unknownField: true }).success,
    ).toBe(false);
  });

  it('mounts AudioPlayer through its public seam renderer without throwing', () => {
    const firstProps = examples[0]?.props ?? {};
    const SeamRenderer = audioPlayerComponent.renderer;
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

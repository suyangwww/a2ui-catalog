import React from 'react';
import {
  LuminaHostContext,
  readOptionalNumber,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import { DrumSequencerView } from './drum-sequencer-view.js';
import { RetroArcadeView } from './retro-arcade-view.js';

export function MicroAppRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const host = React.useContext(LuminaHostContext);
  const title = readString(props.title, 'Micro App');
  const subtitle = readOptionalString(props.subtitle);
  const badge = readOptionalString(props.badge);
  const preset = readString(props.preset, 'retro-arcade');
  const rawGame = readString(props.defaultGame, 'snake');
  const defaultGame =
    rawGame === 'breakout' || rawGame === 'pong' ? rawGame : 'snake';
  const html = readOptionalString(props.html);
  const height = readOptionalNumber(props.height) ?? 420;

  if (preset === 'drum-sequencer') {
    return (
      <section
        className="lumina-micro-app"
        style={weightStyle(props.weight)}
        aria-label={title}
      >
        <DrumSequencerView title={title} subtitle={subtitle} badge={badge} />
      </section>
    );
  }

  if (preset === 'customHtml' && html) {
    const isDark = host.theme === 'dark';
    const themeHeader = `<style>:root{color-scheme:${isDark ? 'dark' : 'light'};--viz-bg:${isDark ? '#141417' : '#ffffff'};--viz-panel:${isDark ? '#1c1c21' : '#f7f7f9'};--viz-text:${isDark ? '#f5f5f7' : '#0d0d0f'};--viz-muted:${isDark ? '#a1a1aa' : '#5e5e66'};--viz-border:${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'};--viz-accent:${isDark ? '#2997ff' : '#0071e3'};}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;background:var(--viz-bg);color:var(--viz-text);}</style>`;
    return (
      <section
        className="lumina-micro-app is-sandbox"
        style={weightStyle(props.weight)}
        aria-label={title}
      >
        <div className="lumina-micro-sandbox-bar">
          <strong>{title}</strong>
          {badge && <span>{badge}</span>}
        </div>
        <iframe
          title={title}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          srcDoc={`${themeHeader}${html}`}
          style={{ height: `${height}px` }}
          className="lumina-micro-iframe"
        />
      </section>
    );
  }

  return (
    <section
      className="lumina-micro-app"
      style={weightStyle(props.weight)}
      aria-label={title}
    >
      <RetroArcadeView title={title} badge={badge} initialMode={defaultGame} />
    </section>
  );
}

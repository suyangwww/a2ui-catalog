import React from 'react';
import {
  readBoolean,
  readOptionalString,
  safeUrl,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function VideoRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const url = safeUrl(props.url);
  const poster = safeUrl(props.posterUrl);
  const title = readOptionalString(props.title);
  const autoPlayMuted = readBoolean(props.autoPlayMuted, false);

  return (
    <figure className="lumina-video-wrap" style={weightStyle(props.weight)}>
      <video
        className="lumina-video-el"
        src={url}
        poster={poster || undefined}
        controls
        playsInline
        muted={autoPlayMuted}
        autoPlay={autoPlayMuted}
      />
      {title && <figcaption className="lumina-video-caption">{title}</figcaption>}
    </figure>
  );
}

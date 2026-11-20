import React from 'react';
import { Maximize2 } from 'lucide-react';
import {
  AdaptiveOverlay,
  LuminaIconGlyph,
  readBoolean,
  readString,
  safeUrl,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

const ASPECT_MAP: Readonly<Record<string, string | undefined>> = {
  '1:1': '1 / 1',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
  '21:9': '21 / 9',
  auto: undefined,
};

const FIT_MAP: Readonly<Record<string, React.CSSProperties['objectFit']>> = {
  contain: 'contain',
  cover: 'cover',
  fill: 'fill',
  none: 'none',
  scaleDown: 'scale-down',
};

export function ImageRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const url = safeUrl(props.url);
  const alt = readString(props.description);
  const variant = readString(props.variant, 'mediumFeature');
  const fit = FIT_MAP[readString(props.fit, 'cover')] ?? 'cover';
  const aspectRatio = ASPECT_MAP[readString(props.aspectRatio, 'auto')];
  const zoomable = readBoolean(props.zoomable, false);
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const [zoomOpen, setZoomOpen] = React.useState(false);

  const wrapStyle: React.CSSProperties = {
    ...weightStyle(props.weight),
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  const imgEl = (
    <div
      className={`lumina-image-wrap lumina-image-${variant} ${zoomable ? 'is-zoomable' : ''}`.trim()}
      style={wrapStyle}
      onClick={zoomable && !errored ? () => setZoomOpen(true) : undefined}
    >
      {!loaded && !errored && <div className="lumina-skeleton" aria-hidden="true" />}
      {errored || !url ? (
        <div className="lumina-image-fallback" role="img" aria-label={alt || 'Image'}>
          <LuminaIconGlyph name="photo" size="lg" />
          {alt && <span>{alt}</span>}
        </div>
      ) : (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`lumina-image-el ${loaded ? 'is-loaded' : ''}`.trim()}
          style={{ objectFit: fit }}
        />
      )}
      {zoomable && !errored && url && (
        <span className="lumina-image-zoom-hint" aria-hidden="true">
          <Maximize2 size={13} />
        </span>
      )}
    </div>
  );

  if (!zoomable) return imgEl;

  return (
    <>
      {imgEl}
      <AdaptiveOverlay
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        title={alt || 'Image Preview'}
        size="lg"
      >
        <img src={url} alt={alt} className="lumina-image-lightbox" />
      </AdaptiveOverlay>
    </>
  );
}

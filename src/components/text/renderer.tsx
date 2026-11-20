import React from 'react';
import {
  LuminaHostContext,
  readBoolean,
  readOptionalNumber,
  readString,
  readTextAlign,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function TextRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const rawText = readString(props.text);
  const variant = readString(props.variant, 'body');
  const tone = readString(props.tone, 'primary');
  const align = readTextAlign(props.align, 'start');
  const maxLines = readOptionalNumber(props.maxLines);
  const { markdownRenderer } = React.useContext(LuminaHostContext);
  const [renderedHtml, setRenderedHtml] = React.useState<string | null>(null);

  const shouldRenderMarkdown =
    variant === 'body' || variant === 'subtitle' || variant === 'caption';

  React.useEffect(() => {
    let active = true;
    if (!shouldRenderMarkdown || !markdownRenderer || !rawText) {
      setRenderedHtml(null);
      return;
    }
    const maybeMarkdown = /[*_`#[\]\n-]/.test(rawText);
    if (!maybeMarkdown) {
      setRenderedHtml(null);
      return;
    }
    Promise.resolve(markdownRenderer(rawText))
      .then((html) => {
        if (active && typeof html === 'string') setRenderedHtml(html);
      })
      .catch(() => {
        if (active) setRenderedHtml(null);
      });
    return () => {
      active = false;
    };
  }, [rawText, shouldRenderMarkdown, markdownRenderer]);

  const style: React.CSSProperties = {
    ...weightStyle(props.weight),
    textAlign: align,
    ...(maxLines !== undefined
      ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }
      : {}),
  };

  const cls = [
    'lumina-text',
    `lumina-text-${variant}`,
    `lumina-tone-fg-${tone}`,
    readBoolean(props.tabularNums, false) ? 'lumina-tabular' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (renderedHtml) {
    return (
      <div
        className={`${cls} lumina-markdown`}
        style={style}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  if (variant === 'hero' || variant === 'h1') {
    return (
      <h1 className={cls} style={style}>
        {rawText}
      </h1>
    );
  }
  if (variant === 'h2') {
    return (
      <h2 className={cls} style={style}>
        {rawText}
      </h2>
    );
  }
  if (variant === 'h3') {
    return (
      <h3 className={cls} style={style}>
        {rawText}
      </h3>
    );
  }
  if (variant === 'code') {
    return (
      <code className={cls} style={style}>
        {rawText}
      </code>
    );
  }
  return (
    <p className={cls} style={style}>
      {rawText}
    </p>
  );
}

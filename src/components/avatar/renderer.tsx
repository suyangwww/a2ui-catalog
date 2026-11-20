import React from 'react';
import {
  readOptionalString,
  readString,
  safeUrl,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return '?';
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] ?? first;
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export function AvatarRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const name = readString(props.name, 'Agent');
  const src = safeUrl(props.src);
  const subtitle = readOptionalString(props.subtitle);
  const size = readString(props.size, 'md');
  const shape = readString(props.shape, 'circle');
  const status = readOptionalString(props.status);
  const [imgFailed, setImgFailed] = React.useState(false);

  const avatarBadge = (
    <span className={`lumina-avatar lumina-avatar-${size} lumina-avatar-${shape}`}>
      {src && !imgFailed ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgFailed(true)}
          className="lumina-avatar-img"
        />
      ) : (
        <span className="lumina-avatar-initials" aria-label={name}>
          {getInitials(name)}
        </span>
      )}
      {status && (
        <span
          className={`lumina-avatar-status lumina-status-${status}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </span>
  );

  if (!subtitle) {
    return (
      <span className="lumina-avatar-only" style={weightStyle(props.weight)}>
        {avatarBadge}
      </span>
    );
  }

  return (
    <div className="lumina-avatar-lockup" style={weightStyle(props.weight)}>
      {avatarBadge}
      <div className="lumina-avatar-meta">
        <div className="lumina-avatar-name">{name}</div>
        <div className="lumina-avatar-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

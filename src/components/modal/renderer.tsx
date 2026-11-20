import React from 'react';
import {
  AdaptiveOverlay,
  invokeSetter,
  readOptionalString,
  readOverlaySize,
  renderChildRef,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function ModalRenderer({ props, buildChild }: LuminaReactRenderArgs): React.ReactNode {
  const [localOpen, setLocalOpen] = React.useState(false);
  const isControlled = typeof props.open === 'boolean';
  const open = isControlled ? Boolean(props.open) : localOpen;

  const handleOpenChange = (next: boolean) => {
    setLocalOpen(next);
    invokeSetter(props.setOpen, next);
  };

  return (
    <div className="lumina-modal-wrapper" style={weightStyle(props.weight)}>
      <div className="lumina-modal-trigger-slot" onClick={() => handleOpenChange(true)}>
        {renderChildRef(buildChild, props.trigger)}
      </div>
      <AdaptiveOverlay
        open={open}
        onOpenChange={handleOpenChange}
        title={readOptionalString(props.title)}
        description={readOptionalString(props.description)}
        size={readOverlaySize(props.size, 'md')}
      >
        {renderChildRef(buildChild, props.content)}
      </AdaptiveOverlay>
    </div>
  );
}

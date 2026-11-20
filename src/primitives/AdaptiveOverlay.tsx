import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { X } from 'lucide-react';
import { springSheet } from './springs.js';
import { LuminaHostContext, useIsMobileViewport } from './context.js';
import type { OverlaySize } from './value-readers.js';

export interface AdaptiveOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | undefined;
  description?: string | undefined;
  size?: OverlaySize | undefined;
  drawerOnDesktop?: boolean | undefined;
  children: React.ReactNode;
}

/**
 * Frosted-glass Dialog/Drawer on Desktop (>= 768px) that adapts into an
 * iOS-style draggable Bottom Sheet on Mobile (< 768px or mobile preview mode).
 */
export function AdaptiveOverlay({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  drawerOnDesktop = false,
  children,
}: AdaptiveOverlayProps) {
  const isMobile = useIsMobileViewport();
  const host = React.useContext(LuminaHostContext);
  const themeAttr = host.theme && host.theme !== 'system' ? host.theme : undefined;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 420) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="lumina-overlay-scrim"
                data-lumina-theme={themeAttr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              {isMobile ? (
                <motion.div
                  className={`lumina-root lumina-bottom-sheet lumina-sheet-${size}`}
                  data-lumina-theme={themeAttr}
                  data-lumina-viewport="mobile"
                  data-lumina-sheet="mobile"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={springSheet}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.06, bottom: 0.5 }}
                  onDragEnd={handleDragEnd}
                >
                  <div className="lumina-sheet-grabber-wrap" aria-hidden="true">
                    <div className="lumina-sheet-grabber" />
                  </div>
                  <div className="lumina-overlay-header">
                    <div className="lumina-overlay-titles">
                      {title ? (
                        <Dialog.Title className="lumina-overlay-title">{title}</Dialog.Title>
                      ) : (
                        <Dialog.Title className="lumina-sr-only">Dialog</Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="lumina-overlay-desc">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button type="button" className="lumina-icon-btn" aria-label="Close">
                        <X size={18} strokeWidth={1.9} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="lumina-overlay-body">{children}</div>
                </motion.div>
              ) : (
                <motion.div
                  className={
                    drawerOnDesktop
                      ? `lumina-root lumina-side-drawer lumina-modal-${size}`
                      : `lumina-root lumina-modal-dialog lumina-modal-${size}`
                  }
                  data-lumina-theme={themeAttr}
                  data-lumina-sheet={drawerOnDesktop ? 'drawer' : 'dialog'}
                  initial={
                    drawerOnDesktop
                      ? { x: '100%', opacity: 0.6 }
                      : { opacity: 0, scale: 0.96, y: 8 }
                  }
                  animate={
                    drawerOnDesktop
                      ? { x: 0, opacity: 1 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={
                    drawerOnDesktop
                      ? { x: '100%', opacity: 0 }
                      : { opacity: 0, scale: 0.96, y: 8 }
                  }
                  transition={springSheet}
                >
                  <div className="lumina-overlay-header">
                    <div className="lumina-overlay-titles">
                      {title ? (
                        <Dialog.Title className="lumina-overlay-title">{title}</Dialog.Title>
                      ) : (
                        <Dialog.Title className="lumina-sr-only">Dialog</Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="lumina-overlay-desc">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button type="button" className="lumina-icon-btn" aria-label="Close">
                        <X size={18} strokeWidth={1.9} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="lumina-overlay-body">{children}</div>
                </motion.div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

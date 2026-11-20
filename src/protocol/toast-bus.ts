export type LuminaToastListener = (message: string) => void;

const toastListeners = new Set<LuminaToastListener>();

export function subscribeLuminaToasts(listener: LuminaToastListener): () => void {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

export function emitLuminaToast(message: string): void {
  for (const listener of toastListeners) {
    try {
      listener(message);
    } catch {
      // Ignore individual subscriber errors
    }
  }
}

import { useEffect } from 'react';

type Options = { enabled?: boolean };

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void,
  opts: Options = {},
) {
  const enabled = opts.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && !el.contains(target)) {
        onOutside();
      }
    };

    document.addEventListener('mousedown', handler, { passive: true });
    document.addEventListener('touchstart', handler as EventListener, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handler as EventListener);
      document.removeEventListener('touchstart', handler as EventListener);
    };
  }, [enabled, ref, onOutside]);
}

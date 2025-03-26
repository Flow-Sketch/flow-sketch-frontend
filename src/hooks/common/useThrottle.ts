import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => void>(func: T, delay: number) {
  const lastExecuted = useRef<number>(0);
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        func(...args);
        lastExecuted.current = now;
      }
    },
    [func, delay],
  );
}

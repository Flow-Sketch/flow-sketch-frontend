import { useEffect, useRef } from 'react';

export function useTraceUpdate_DEV(props: Record<string, any>) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (ps, [key, value]) => {
        if (prev.current[key] !== value) {
          ps[key] = [prev.current[key], value];
        }
        return ps;
      },
      {} as Record<string, [any, any]>,
    );

    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }

    prev.current = props;
  });
}

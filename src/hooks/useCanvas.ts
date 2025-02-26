import { useEffect, useRef } from 'react';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화;
    canvas.width = 1000;
    canvas.height = 800;
    canvas.style.background = '#dfdfdf';

    // 필요한 경우 cleanup 함수 추가
    return () => {
      // 정리 로직
    };
  }, []);

  return { canvasRef };
}

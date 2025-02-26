import { useEffect, useRef } from 'react';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화;
    canvas.width = 1300;
    canvas.height = 900;

    // 캔버스의 가상공간을 표현
    ctx.fillStyle = '#dfdfdf';

    // 필요한 경우 cleanup 함수 추가
    return () => {
      // 정리 로직
    };
  }, []);

  return { canvasRef };
}

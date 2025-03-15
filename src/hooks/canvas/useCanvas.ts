import { useEffect, useRef, useState } from 'react';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // 캔버스의 가상공간을 표현
    ctx.fillStyle = '#dfdfdf';
  }, [canvasSize]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setCanvasSize({ width: newWidth, height: newHeight });

      // 캔버스 요소 크기 직접 설정
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };

    handleResize(); // 초기 업로드 시 사이즈를 체크
    window.addEventListener('resize', handleResize);

    // 언마운트 시 등록한 이벤트 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { canvasRef };
}

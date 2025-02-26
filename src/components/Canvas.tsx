import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 800;
    canvas.style.background = '#dfdfdf';
  }, []);

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleDrawRect = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.preventDefault(); // 기본 우클릭 메뉴 비활성화

    const rectSize = 20; // 사각형 크기
    const x = e.nativeEvent.offsetX - rectSize / 2;
    const y = e.nativeEvent.offsetY - rectSize / 2;

    ctx.fillStyle = getRandomColor(); // 랜덤 색상
    ctx.fillRect(x, y, rectSize, rectSize);
    console.log(`x : ${e.nativeEvent.offsetX} / y : ${e.nativeEvent.offsetY}`);
  };

  // 랜덤 색상 생성 함수
  const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
  };

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleDrawRect}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

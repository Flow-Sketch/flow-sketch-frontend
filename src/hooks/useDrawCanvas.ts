import * as React from 'react';
import { useCallback, useState } from 'react';
import { DrawFunction } from '@/utils/drawingUtils.ts';

export function useDrawCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawFunctions: DrawFunction[] = [],
  selectFunction: number = 0,
) {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleDraw = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault(); // 기본 우클릭 메뉴 비활성화

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const drawFunction = drawFunctions[selectFunction];
      if (!drawFunction) return;

      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;

      drawFunction(ctx, x, y, isDrawing);
    },
    [isDrawing],
  );

  return {
    handleMouseDown,
    handleMouseUp,
    handleDraw,
  };
}

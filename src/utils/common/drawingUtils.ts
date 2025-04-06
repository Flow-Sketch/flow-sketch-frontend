// 그리기 함수 타입 정의
import { getRandomColor } from '@/utils/common/getRandomColor.ts';

export type DrawFunction = (ctx: CanvasRenderingContext2D, x: number, y: number, isDrawing: boolean) => void;

// 사각형 그리기
export const drawRect: DrawFunction = (ctx, x, y, isDrawing) => {
  if (!isDrawing) return;

  const rectSize = 20;

  ctx.fillStyle = getRandomColor();
  ctx.fillRect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize);
};

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ElementRegistry } from '@/hooks/useCanvasElementManager.ts';

// 추후
const CANVAS_WIDTH = 20000; // 실제 캔버스의 크기
const CANVAS_HEIGHT = 20000; // 실제 캔버스의 크기
const VIEW_WIDTH = 1000; // 사용자가 보는 화면의 크기
const VIEW_HEIGHT = 800; // 사용자가 보는 화면의 크기

export function useTranslateCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, registry: ElementRegistry) {
  /** 시점 변경에 필요한 상태들
   * ### 동작원리
   * - 시점 이동(x축, y축)시, 클릭한 지점(startPosition)을 시작 지점으로 잡음
   * - 마우스를 클릭하고 있는동안, 계속 이동한 거리를 지속적으로 잡는다.
   * ### 특징
   * - 지점은 절대좌표 기준으로 잡는다.
   */
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 최종 마우스로 이동시킨 거리
  const [startPosition, setStartPosition] = useState({ x: -20, y: -20 }); // 마우스를 클릭한 순간의 지정

  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 현재 캔버스에 그려진 pixel 정보들을 제거한다.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 원래배율(1배율)상태의 캔버스를 저장
    ctx.save();

    // 배율을 적용해 페인팅을 한다.
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    drawShapes(ctx, registry);

    // 다시 원래배율로 적용, 이미 페인팅된 pixel 들은 변경되지 않는다.
    ctx.restore();
  }, [isDrawing, scale, offset]);

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!event) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const minWidthScale = VIEW_WIDTH / CANVAS_WIDTH;
    const minHeightScale = VIEW_HEIGHT / CANVAS_HEIGHT;

    event.preventDefault();
    const MAX_SCALE = 3;
    const MIN_SCALE = Math.max(minWidthScale, minHeightScale);
    const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * scaleAmount));
    setScale(newScale);

    // 보정하기
    setOffset((prev) => ({
      x: rangePosition(prev.x, -(CANVAS_WIDTH * scale) + VIEW_WIDTH, 0),
      y: rangePosition(prev.y, -(CANVAS_HEIGHT * scale) + VIEW_HEIGHT, 0),
    }));
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

    // 캔버스 내에서 클릭한 마우스커서의 상대위치
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    setIsDrawing(true);
    setStartPosition({
      x: currentX,
      y: currentY,
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setStartPosition({
      x: 0,
      y: 0,
    });
  };

  const handleMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isDrawing) return;

    // 클릭한 시점을 기준으로, 한번의 mouseEvent 로 변경된 delta 값을 offset 에 반영한다.
    const deltaX = event.nativeEvent.offsetX - startPosition.x;
    const deltaY = event.nativeEvent.offsetY - startPosition.y;

    // 한번의 mouseEvent 가 끝나면 startPosition 을 초기화한다.
    setStartPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });

    setOffset((prev) => ({
      x: rangePosition(deltaX + prev.x, -(CANVAS_WIDTH * scale) + VIEW_WIDTH, 0),
      y: rangePosition(deltaY + prev.y, -(CANVAS_HEIGHT * scale) + VIEW_HEIGHT, 0),
    }));
  };

  return {
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handleMove,
  };
}

function rangePosition(prev: number, min: number, max: number) {
  if (prev < min) return min;
  if (prev > max) return max;
  return prev;
}

function drawShapes(ctx: CanvasRenderingContext2D, registry: ElementRegistry) {
  const { elements, layerOrder } = registry;

  // 큰 배경 격자 그리기 (10x10칸)
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ctx.fillStyle = i % 2 === j % 2 ? '#ddd' : '#bbb';
      ctx.fillRect(i * 200, j * 200, 200, 200);
    }
  }

  // `useCanvasElementManager` Hook 에 대한 각 도형 요소들 모두 draw
  for (const elementId of layerOrder) {
    elements[elementId].draw(ctx);
  }
}

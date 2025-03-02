import * as React from 'react';
import { useEffect, useState } from 'react';

export function useSelectElement(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [isSelectable, setSelectable] = useState<boolean>(false); // 선택모드가 켜져있는지를 확인
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 위치
  const [endPosition, setEndPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 놓은 순간의 위치

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // mouseUp 으로 select 모드가 종료되었을 때, select box 를 제거하기 위해 캔버스를 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!startPosition || !endPosition) return;

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#dfdfdf';
    ctx.fillStyle = 'transparent';

    ctx.beginPath();
    ctx.rect(
      Math.min(startPosition.x, endPosition.x),
      Math.min(startPosition.y, endPosition.y),
      Math.abs(startPosition.x - endPosition.x),
      Math.abs(startPosition.y - endPosition.y),
    );
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }, [isSelectable, endPosition]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

    const newStartPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    setStartPosition(newStartPosition);
    setEndPosition(newStartPosition); // 사각형이 0,0에서 그려지는 문제 방지
    setSelectable(true);
  };

  const handleMouseUp = () => {
    setSelectable(false);
    setStartPosition(null);
    setEndPosition(null);
  };

  const handleMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isSelectable || !startPosition) return;

    setEndPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMove,
  };
}

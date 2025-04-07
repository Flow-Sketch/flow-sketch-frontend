import { useEffect, useState } from 'react';
import * as React from 'react';

export function useDrawRect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [isSelectable, setSelectable] = useState<boolean>(false); // 선택모드가 켜져있는지를 확인
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 위치
  const [endPosition, setEndPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 놓은 순간의 위치

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isSelectable || !startPosition || !endPosition) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 현재 캔버스에 그려진 pixel 정보들을 제거한다.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

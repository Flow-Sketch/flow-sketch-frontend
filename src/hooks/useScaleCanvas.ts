import * as React from 'react';
import { useState } from 'react';

export function useScaleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [scale, setScale] = useState(1);

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!event) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    event.preventDefault();
    const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * scaleAmount));
    setScale(newScale);
    ctx.scale(newScale, newScale);
  };

  return {
    handleWheel,
  };
}

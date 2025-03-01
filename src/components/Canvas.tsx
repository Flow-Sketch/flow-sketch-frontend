import { css } from '@emotion/react';
import { useCanvas, useCanvasElementManager, useTranslateCanvas } from '@/hooks';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { elementRegistry } = useCanvasElementManager();
  const { handleWheel, handleMove, handleMouseDown, handleMouseUp } = useTranslateCanvas(canvasRef, elementRegistry);

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMove}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

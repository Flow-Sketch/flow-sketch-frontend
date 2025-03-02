import { css } from '@emotion/react';
import { useCanvas, useCanvasElementManager, useTranslateCanvas } from '@/hooks';
import { useSelectElement } from '@/hooks/useSelectElement.ts';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { elementRegistry } = useCanvasElementManager();
  const { handleWheel } = useTranslateCanvas(canvasRef, elementRegistry);
  const { handleMove, handleMouseDown, handleMouseUp } = useSelectElement(canvasRef);

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

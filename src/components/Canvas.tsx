import { css } from '@emotion/react';
import { drawRect } from '@/utils/drawingUtils.ts';
import { useCanvas, useDrawCanvas } from '@/hooks';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { handleMouseUp, handleMouseDown, handleDraw } = useDrawCanvas(canvasRef, [drawRect]);

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
        onMouseMove={handleDraw}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

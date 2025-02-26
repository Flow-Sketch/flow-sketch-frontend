import { css } from '@emotion/react';
import { drawRect } from '@/utils/drawingUtils.ts';
import { useCanvas, useDrawCanvas, useScaleCanvas } from '@/hooks';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { handleWheel } = useScaleCanvas(canvasRef);
  const { handleMouseUp, handleMouseDown, handleDraw } = useDrawCanvas(canvasRef, [drawRect]);

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
        onMouseMove={handleDraw}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

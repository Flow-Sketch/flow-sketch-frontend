import { css } from '@emotion/react';
import { useCanvas, useTranslateCanvas } from '@/hooks';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { handleWheel, handleMove, handleMouseDown, handleMouseUp } = useTranslateCanvas(canvasRef);

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

import { css } from '@emotion/react';
import {
  useCanvas,
  useCanvasElementManager,
  useCanvasSelectManager,
  useCanvasViewManager,
  usePaintingCanvas,
  useActionHandler,
} from '@/hooks';
import { useCanvasCreateElementManger } from '@/hooks/useCanvasCreateElementManger.ts';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { viewState, viewAction } = useCanvasViewManager();
  const { elementRegistry, elementRegistryAction } = useCanvasElementManager();
  const { selectState, selectAction } = useCanvasSelectManager(elementRegistry, viewState);
  const { createState, createAction } = useCanvasCreateElementManger(viewState, elementRegistryAction);

  const handler = useActionHandler(viewAction, selectAction, createAction);
  usePaintingCanvas(canvasRef, elementRegistry, viewState, selectState, createState);

  return (
    <div
      css={css`
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
      `}
    >
      <canvas
        ref={canvasRef}
        onWheel={handler.handleWheel}
        onMouseDown={handler.handleMouseDown}
        onMouseUp={handler.handleMouseUp}
        onMouseMove={handler.handleMouseMove}
        onMouseLeave={handler.handleMouseUp}
      />
    </div>
  );
};

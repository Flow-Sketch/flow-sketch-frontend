import { css } from '@emotion/react';
import {
  useCanvas,
  useCanvasElementManager,
  useCanvasSelectManager,
  useCanvasViewManager,
  usePaintingCanvas,
  useActionHandler,
  useCanvasRemoteStore,
} from '@/hooks';

export const Canvas = () => {
  const remoteMode = useCanvasRemoteStore((store) => store.mode);
  const { canvasRef } = useCanvas();
  const { elementRegistry } = useCanvasElementManager();
  const { viewState, viewAction } = useCanvasViewManager();
  const { selectState, selectAction } = useCanvasSelectManager(elementRegistry, viewState);
  const { handler } = useActionHandler(remoteMode, viewAction, selectAction);

  usePaintingCanvas(canvasRef, elementRegistry, viewState, selectState);

  return (
    <div
      css={css`
        display: flex;
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

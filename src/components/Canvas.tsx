import { css } from '@emotion/react';
import {
  useCanvas,
  useCanvasElementManager,
  useCanvasSelectManager,
  useCanvasViewManager,
  usePaintingCanvas,
  useActionHandler,
} from '@/hooks';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { elementRegistry } = useCanvasElementManager();
  const { viewState, viewAction } = useCanvasViewManager();
  const { selectState, selectAction } = useCanvasSelectManager(elementRegistry, viewState);
  const { isViewMode, changeViewMode, handler } = useActionHandler(viewAction, selectAction);
  usePaintingCanvas(canvasRef, elementRegistry, viewState, selectState);

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      {isViewMode ? <p onClick={changeViewMode}>보기모드</p> : <p onClick={changeViewMode}>편집모드</p>}
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

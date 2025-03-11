import { css } from '@emotion/react';
import {
  useCanvas,
  usePaintingCanvas,
  useCanvasViewManager,
  useCanvasSelectManager,
  useCanvasActionHandler,
  useCanvasElementManager,
  useCanvasCreateElementManger,
  useCanvasDeleteElementManager,
  useCanvasMoveElementManager,
  useCanvasResizeElementManager,
} from '@/hooks/canvas';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { viewState, viewAction } = useCanvasViewManager();
  const { elementRegistry, elementRegistryAction } = useCanvasElementManager();
  const { selectState, selectAction } = useCanvasSelectManager(elementRegistry, viewState);
  const { createState, createAction } = useCanvasCreateElementManger(viewState, elementRegistryAction);
  const { deleteAction } = useCanvasDeleteElementManager(selectState, selectAction, elementRegistryAction); // 이 Hook 꼭 리펙토링이 필요!
  const { resizeAction } = useCanvasResizeElementManager(viewState, selectState, elementRegistryAction);
  const { moveAction } = useCanvasMoveElementManager(viewState, selectState, elementRegistryAction);

  const handler = useCanvasActionHandler(selectState, viewAction, selectAction, createAction, deleteAction, moveAction, resizeAction);
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
      {/*
      // 임시 비활성화
      <SelectionMenu deleteState={deleteState} deleteAction={deleteAction} />
      */}
      <canvas
        css={css`
          outline: none;
          &:focus {
            outline: none;
            box-shadow: none;
          }
        `}
        tabIndex={1}
        ref={canvasRef}
        onWheel={handler.handleWheel}
        onMouseDown={handler.handleMouseDown}
        onMouseUp={handler.handleMouseUp}
        onMouseMove={handler.handleMouseMove}
        onMouseLeave={handler.handleMouseUp}
        onKeyDown={handler.handleKeyDown}
      />
    </div>
  );
};

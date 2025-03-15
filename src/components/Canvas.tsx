import { css } from '@emotion/react';
import {
  useCanvas,
  usePaintingCanvas,
  useCanvasViewManager,
  useCanvasSelectElementManager,
  useCanvasActionHandler,
  useCanvasElementManager,
  useCanvasCreateElementManger,
  useCanvasDeleteElementManager,
  useCanvasMoveElementManager,
  useCanvasResizeElementManager,
} from '@/hooks/canvas';
import { SelectionMenu } from '@/components/SelectionMenu.tsx';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { viewState, viewAction } = useCanvasViewManager();
  const { selectState, selectAction } = useCanvasSelectElementManager();
  const { elementRegistry, elementRegistryAction } = useCanvasElementManager();
  const { createState, createAction } = useCanvasCreateElementManger(elementRegistryAction);
  const { moveState, moveAction } = useCanvasMoveElementManager(elementRegistryAction);
  const { resizeAction } = useCanvasResizeElementManager(elementRegistryAction);
  const { deleteAction } = useCanvasDeleteElementManager(selectAction, elementRegistryAction); // 이 Hook 꼭 리펙토링이 필요!

  const handler = useCanvasActionHandler(viewAction, selectAction, createAction, deleteAction, moveAction, resizeAction);
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
      <SelectionMenu moveState={moveState} deleteAction={deleteAction} />
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
        onKeyDown={handler.handleKeyDown}
      />
    </div>
  );
};

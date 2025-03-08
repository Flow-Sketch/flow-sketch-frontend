import { css } from '@emotion/react';
import {
  useCanvas,
  useCanvasElementManager,
  useCanvasSelectManager,
  useCanvasViewManager,
  usePaintingCanvas,
  useActionHandler,
  useCanvasDeleteElementManager,
} from '@/hooks';
import { useCanvasCreateElementManger } from '@/hooks/useCanvasCreateElementManger.ts';
import { SelectionMenu } from '@/components/SelectionMenu.tsx';

export const Canvas = () => {
  const { canvasRef } = useCanvas();
  const { viewState, viewAction } = useCanvasViewManager();
  const { elementRegistry, elementRegistryAction } = useCanvasElementManager();
  const { selectState, selectAction } = useCanvasSelectManager(elementRegistry, viewState);
  const { createState, createAction } = useCanvasCreateElementManger(viewState, elementRegistryAction);
  const { deleteState, deleteAction } = useCanvasDeleteElementManager(selectState, selectAction, elementRegistryAction); // 이 Hook 꼭 리펙토링이 필요!

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
      <SelectionMenu deleteState={deleteState} deleteAction={deleteAction} />
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

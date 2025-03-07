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
import { useCanvasCreateElementManger } from '@/hooks/useCanvasCreateElementManger.ts';

export const Canvas = () => {
  const shapeType = useCanvasRemoteStore((store) => store.shapeType);
  const remoteMode = useCanvasRemoteStore((store) => store.mode);
  const { canvasRef } = useCanvas();
  const { viewState, viewAction } = useCanvasViewManager();
  const { elementRegistry, elementRegistryAction } = useCanvasElementManager();
  const { selectState, selectAction } = useCanvasSelectManager(elementRegistry, viewState);
  const { createState, createAction } = useCanvasCreateElementManger(shapeType, viewState, elementRegistryAction);
  const { handler } = useActionHandler(remoteMode, shapeType, viewAction, selectAction, createAction); // 나중에 리펙토링 필요해보임. 거의 엑조디아 급임.

  usePaintingCanvas(canvasRef, elementRegistry, viewState, selectState, createState);

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

import styled from '@emotion/styled';
import {
  useCanvas,
  usePaintingCanvas,
  useCanvasViewManager,
  useCanvasSelectElementManager,
  useCanvasActionHandler,
  useCanvasElementRegistry,
  useCanvasCreateElementManger,
  useCanvasDeleteElementManager,
  useCanvasMoveElementManager,
  useCanvasResizeElementManager,
} from 'src/hooks/canvasElement';
import { useRemoteManager } from '@/hooks/remote';
import { SelectionMenu } from '@/components/SelectionMenu.tsx';

export const CanvasBoard = () => {
  const { canvasRef } = useCanvas();
  const { remoteAction } = useRemoteManager();
  const { viewState, viewAction } = useCanvasViewManager();
  const { selectState, selectAction } = useCanvasSelectElementManager();
  const { elementRegistry, elementRegistryAction } = useCanvasElementRegistry();
  const { createState, createAction } = useCanvasCreateElementManger(remoteAction, elementRegistryAction);
  const { moveState, moveAction } = useCanvasMoveElementManager(elementRegistryAction);
  const { deleteAction } = useCanvasDeleteElementManager(selectAction, elementRegistryAction);
  const { resizeAction } = useCanvasResizeElementManager(elementRegistryAction);

  const handler = useCanvasActionHandler({
    viewAction,
    selectAction,
    createAction,
    deleteAction,
    moveAction,
    resizeAction,
  });

  usePaintingCanvas(canvasRef, {
    elementRegistry,
    viewState,
    selectState,
    createState,
  });

  return (
    <Container>
      <SelectionMenu moveState={moveState} deleteAction={deleteAction} />
      <Canvas
        tabIndex={1}
        ref={canvasRef}
        onWheel={handler.handleWheel}
        onMouseDown={handler.handleMouseDown}
        onMouseUp={handler.handleMouseUp}
        onMouseMove={handler.handleMouseMove}
        onKeyDown={handler.handleKeyDown}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
`;

const Canvas = styled.canvas`
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

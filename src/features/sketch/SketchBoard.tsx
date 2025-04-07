import styled from '@emotion/styled';
import {
  useCanvas,
  usePaintingSketchBoard,
  useCameraViewManager,
  useSelectElementManager,
  useCanvasActionHandler,
  useElementRegistry,
  useCreateElementManger,
  useDeleteElementManager,
  useMoveElementManager,
  useResizeElementManager,
  useRemoteManager,
} from './hooks';
import { SelectionMenu } from './SelectionMenu';

export const SketchBoard = () => {
  const { canvasRef } = useCanvas();
  const { remoteAction } = useRemoteManager();
  const { viewState, viewAction } = useCameraViewManager();
  const { selectState, selectAction } = useSelectElementManager();
  const { elementRegistry, elementRegistryAction } = useElementRegistry();
  const { createState, createAction } = useCreateElementManger(remoteAction, elementRegistryAction);
  const { moveState, moveAction } = useMoveElementManager(elementRegistryAction);
  const { deleteAction } = useDeleteElementManager(selectAction, elementRegistryAction);
  const { resizeAction } = useResizeElementManager(elementRegistryAction);

  const handler = useCanvasActionHandler({
    viewAction,
    selectAction,
    createAction,
    deleteAction,
    moveAction,
    resizeAction,
  });

  usePaintingSketchBoard(canvasRef, {
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

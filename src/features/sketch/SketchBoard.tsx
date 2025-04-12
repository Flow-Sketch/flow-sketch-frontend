import styled from '@emotion/styled';
import { SelectionMenu } from './SelectionMenu';
import { SketchContextMenu } from './SketchContextMenu';
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
  useClipboardElementManager,
  useRemoteManager,
} from './hooks';

export const SketchBoard = () => {
  const { canvasRef } = useCanvas();
  const { elementRegistry, elementRegistryAction } = useElementRegistry();

  // Element 조작기능 Hooks
  const { remoteAction } = useRemoteManager();
  const { viewState, viewAction } = useCameraViewManager();
  const { selectState, selectAction } = useSelectElementManager();
  const { moveState, moveAction } = useMoveElementManager(selectState, elementRegistryAction);
  const { createState, createAction } = useCreateElementManger(remoteAction, elementRegistryAction);
  const { deleteAction } = useDeleteElementManager(selectState, selectAction, elementRegistryAction);
  const { clipboardAction } = useClipboardElementManager(selectAction, elementRegistryAction);
  const { resizeAction } = useResizeElementManager(selectState, elementRegistryAction);

  const handler = useCanvasActionHandler({
    viewAction,
    selectAction,
    createAction,
    deleteAction,
    moveAction,
    resizeAction,
    clipboardAction,
  });

  usePaintingSketchBoard(canvasRef, {
    elementRegistry,
    viewState,
    selectState,
    createState,
  });

  return (
    <Container>
      <SelectionMenu selectState={selectState} moveState={moveState} deleteAction={deleteAction} />
      <SketchContextMenu selectState={selectState} clipboardAction={clipboardAction} deleteAction={deleteAction}>
        <Canvas
          tabIndex={1}
          ref={canvasRef}
          onWheel={handler.handleWheel}
          onMouseDown={handler.handleMouseDown}
          onMouseUp={handler.handleMouseUp}
          onMouseMove={handler.handleMouseMove}
          onKeyDown={handler.handleKeyDown}
        />
      </SketchContextMenu>
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

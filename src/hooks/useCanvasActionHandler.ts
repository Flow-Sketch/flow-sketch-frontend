import { ViewManagerAction } from '@/hooks/useCanvasViewManager.ts';
import { SelectManagerAction } from '@/hooks/useCanvasSelectManager.ts';
import { CreateElementMangerAction } from '@/hooks/useCanvasCreateElementManger.ts';
import { useCanvasRemoteStore } from '@/hooks/useCanvasRemoteStore.ts';
import { DeleteManagerAction } from '@/hooks/useCanvasDeleteElementManager.ts';
import { MoveManagerAction } from '@/hooks/useCanvasMoveElementManager.ts';

export function useCanvasActionHandler(
  viewAction: ViewManagerAction,
  selectAction: SelectManagerAction,
  createAction: CreateElementMangerAction,
  deleteAction: DeleteManagerAction,
  moveAction: MoveManagerAction,
) {
  const shapeType = useCanvasRemoteStore((store) => store.shapeType);
  const remoteMode = useCanvasRemoteStore((store) => store.mode);
  const handleWheel = (() => {
    if (remoteMode === 'view') return viewAction.handleWheel;
  })();

  const handleMouseDown = (() => {
    if (remoteMode === 'view') return viewAction.handleMouseDown;
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseDown;
      return moveAction.handleMouseDown;
    }
    return selectAction.handleMouseDown;
  })();

  const handleMouseUp = (() => {
    if (remoteMode === 'view') return viewAction.handleMouseUp;
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseUp;
      return moveAction.handleMouseUp;
    }
    return selectAction.handleMouseUp;
  })();

  const handleMouseMove = (() => {
    if (remoteMode === 'view') return viewAction.handleMouseMove;
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseMove;
      return moveAction.handleMouseMove;
    }
    return selectAction.handleMouseMove;
  })();

  const handleKeyDown = (() => {
    if (remoteMode === 'edit') {
      return deleteAction.handleKeyDown;
    }
  })();

  return {
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleKeyDown,
  };
}

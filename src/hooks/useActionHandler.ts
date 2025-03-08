import { ViewManagerAction } from '@/hooks/useCanvasViewManager.ts';
import { SelectManagerAction } from '@/hooks/useCanvasSelectManager.ts';
import { CreateElementMangerAction } from '@/hooks/useCanvasCreateElementManger.ts';
import { useCanvasRemoteStore } from '@/hooks/useCanvasRemoteStore.ts';

export function useActionHandler(
  viewAction: ViewManagerAction,
  selectAction: SelectManagerAction,
  createAction: CreateElementMangerAction,
) {
  const shapeType = useCanvasRemoteStore((store) => store.shapeType);
  const remoteMode = useCanvasRemoteStore((store) => store.mode);
  const handleWheel = (() => {
    if (remoteMode === 'view') return viewAction.handleWheel;
  })();

  const handleMouseDown = (() => {
    if (remoteMode === 'view') return viewAction.handleMouseDown;
    if (shapeType) return createAction.handleMouseDown;
    return selectAction.handleMouseDown;
  })();

  const handleMouseUp = (() => {
    if (remoteMode === 'view') return viewAction.handleMouseUp;
    if (shapeType) return createAction.handleMouseUp;
    return selectAction.handleMouseUp;
  })();

  const handleMouseMove = (() => {
    if (remoteMode === 'view') return viewAction.handleMouseMove;
    if (shapeType) return createAction.handleMouseMove;
    return selectAction.handleMouseMove;
  })();

  return {
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
}

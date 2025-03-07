import { RemoteMode, ShapeType } from '@/hooks/useCanvasRemoteStore.ts';
import { ViewManagerAction } from '@/hooks/useCanvasViewManager.ts';
import { SelectManagerAction } from '@/hooks/useCanvasSelectManager.ts';
import { CreateElementMangerAction } from '@/hooks/useCanvasCreateElementManger.ts';

export function useActionHandler(
  mode: RemoteMode,
  shapeType: ShapeType,
  viewAction: ViewManagerAction,
  selectAction: SelectManagerAction,
  createAction: CreateElementMangerAction,
) {
  const handleWheel = (() => {
    if (mode === 'view') return viewAction.handleWheel;
  })();

  const handleMouseDown = (() => {
    if (mode === 'view') return viewAction.handleMouseDown;
    if (shapeType) return createAction.handleMouseDown;
    return selectAction.handleMouseDown;
  })();

  const handleMouseUp = (() => {
    if (mode === 'view') return viewAction.handleMouseUp;
    if (shapeType) return createAction.handleMouseUp;
    return selectAction.handleMouseUp;
  })();

  const handleMouseMove = (() => {
    if (mode === 'view') return viewAction.handleMouseMove;
    if (shapeType) return createAction.handleMouseMove;
    return selectAction.handleMouseMove;
  })();

  return {
    handler: {
      handleWheel,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
    },
  };
}

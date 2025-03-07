import { RemoteMode } from '@/hooks/useCanvasRemoteStore.ts';
import { ViewManagerAction } from '@/hooks/useCanvasViewManager.ts';
import { SelectManagerAction } from '@/hooks/useCanvasSelectManager.ts';

export function useActionHandler(mode: RemoteMode, viewAction: ViewManagerAction, selectAction: SelectManagerAction) {
  const handleWheel = mode === 'view' ? viewAction.handleWheel : undefined;
  const handleMouseDown = mode === 'view' ? viewAction.handleMouseDown : selectAction.handleMouseDown;
  const handleMouseUp = mode === 'view' ? viewAction.handleMouseUp : selectAction.handleMouseUp;
  const handleMouseMove = mode === 'view' ? viewAction.handleMouseMove : selectAction.handleMouseMove;

  return {
    handler: {
      handleWheel,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
    },
  };
}

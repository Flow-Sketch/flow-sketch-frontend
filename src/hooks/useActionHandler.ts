import { useState } from 'react';
import { ViewManagerAction } from '@/hooks/useCanvasViewManager.ts';
import { SelectManagerAction } from '@/hooks/useCanvasSelectManager.ts';

export function useActionHandler(viewAction: ViewManagerAction, selectAction: SelectManagerAction) {
  const [isViewMode, setViewMode] = useState<boolean>(true);
  const handleWheel = isViewMode ? viewAction.handleWheel : undefined;
  const handleMouseDown = isViewMode ? viewAction.handleMouseDown : selectAction.handleMouseDown;
  const handleMouseUp = isViewMode ? viewAction.handleMouseUp : selectAction.handleMouseUp;
  const handleMouseMove = isViewMode ? viewAction.handleMouseMove : selectAction.handleMouseMove;

  function changeViewMode() {
    setViewMode((prev) => !prev);
  }

  return {
    isViewMode,
    changeViewMode,
    handler: {
      handleWheel,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
    },
  };
}

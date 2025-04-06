import { useCallback, useRef } from 'react';
import { useSketchFilesRegistry } from '@/features/sketchFile/hooks/useSketchFilesRegistry.ts';

type EditCanvasBoardManagerAction = {
  editElementBoard: (canvasId: string, elementRegistry: unknown) => void;
  editMetaBoard: (canvasId: string, meta: unknown) => void;
};

export function useEditSketchFileManager(): {
  editAction: EditCanvasBoardManagerAction;
} {
  const { boardAction } = useSketchFilesRegistry();
  const throttleEditElementBoard = useThrottle(boardAction.editElementBoard, 300);

  const editElementBoard = (canvasId: string, elementRegistry: unknown) => {
    throttleEditElementBoard(canvasId, elementRegistry);
  };

  const editMetaBoard = (canvasId: string, meta: unknown) => {
    boardAction.editMetaBoard(canvasId, meta);
  };

  return {
    editAction: {
      editElementBoard,
      editMetaBoard,
    },
  };
}

function useThrottle<T extends (...args: any[]) => void>(func: T, delay: number) {
  const lastExecuted = useRef<number>(0);
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        func(...args);
        lastExecuted.current = now;
      }
    },
    [func, delay],
  );
}

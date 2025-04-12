import { useEffect, useState } from 'react';
import { ElementRegistryAction, SelectManagerAction, SelectManagerState } from '@/features/sketch/hooks/index.ts';

export type DeleteManagerState = {
  menuPosition: {
    x: number;
    y: number;
  } | null;
};

export type DeleteManagerAction = {
  handleDeleteElements: () => void;
};

export function useDeleteElementManager(
  selectState: SelectManagerState,
  selectAction: SelectManagerAction,
  registryAction: ElementRegistryAction,
): {
  deleteState: DeleteManagerState;
  deleteAction: DeleteManagerAction;
} {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!selectState.boundingBox) return;
    setMenuPosition({
      x: selectState.boundingBox.cx,
      y: selectState.boundingBox.cy - selectState.boundingBox.height / 2 + 20,
    });
  }, [selectState.boundingBox]);

  const handleDeleteElements = () => {
    const { selectElements } = selectState;
    registryAction.deleteElements(selectElements);
    selectAction.handleClearSelection();
  };

  return {
    deleteState: {
      menuPosition,
    },
    deleteAction: {
      handleDeleteElements,
    },
  };
}

import { useEffect } from 'react';
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
  deleteAction: DeleteManagerAction;
} {
  useEffect(() => {
    if (!selectState.boundingBox) return;
  }, [selectState.boundingBox]);

  const handleDeleteElements = () => {
    const { selectElements } = selectState;
    registryAction.deleteElements(selectElements);
    selectAction.handleClearSelection();
  };

  return {
    deleteAction: {
      handleDeleteElements,
    },
  };
}

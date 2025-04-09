import { useEffect, useState } from 'react';
import { useElementRegistryStore } from 'src/core/stores';
import { ElementRegistryAction, SelectManagerAction } from '@/features/sketch/hooks/index.ts';

export type DeleteManagerState = {
  menuPosition: {
    x: number;
    y: number;
  } | null;
};

export type DeleteManagerAction = {
  handleDeleteElement: () => void;
};

export function useDeleteElementManager(
  selectAction: SelectManagerAction,
  registryAction: ElementRegistryAction,
): {
  deleteState: DeleteManagerState;
  deleteAction: DeleteManagerAction;
} {
  const userId = 'testUser';
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const selectState = useElementRegistryStore((store) => store.selectElements[userId]);

  useEffect(() => {
    setMenuPosition({
      x: selectState.boundingBox.cx,
      y: selectState.boundingBox.cy - selectState.boundingBox.height / 2 + 20,
    });
  }, [selectState.boundingBox.width, selectState.boundingBox.height]);

  const handleDeleteElement = () => {
    const { elements } = selectState;
    const elementKeys = Object.keys(elements);
    registryAction.deleteElements(elementKeys);
    selectAction.resetElement();
  };

  return {
    deleteState: {
      menuPosition,
    },
    deleteAction: {
      handleDeleteElement,
    },
  };
}

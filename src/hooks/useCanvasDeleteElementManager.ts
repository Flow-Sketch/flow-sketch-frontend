import { useEffect, useState } from 'react';
import { SelectManagerAction, SelectManagerState } from '@/hooks/useCanvasSelectManager.ts';
import { ElementRegistryAction } from '@/hooks/useCanvasElementManager.ts';

export type DeleteManagerState = {
  isActivate: boolean;
  menuPosition: {
    x: number;
    y: number;
  } | null;
};

export type DeleteManagerAction = {
  handleOnClick: () => void;
};

export function useCanvasDeleteElementManager(
  selectState: SelectManagerState,
  selectAction: SelectManagerAction,
  registryAction: ElementRegistryAction,
): {
  deleteState: DeleteManagerState;
  deleteAction: DeleteManagerAction;
} {
  const [isActivate] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMenuPosition({
      x: selectState.boundingBox.cx,
      y: selectState.boundingBox.cy - selectState.boundingBox.height / 2 + 20,
    });
  }, [selectState.boundingBox.width, selectState.boundingBox.height]);

  const handleOnClick = () => {
    const { selectElement } = selectState;
    const elementKeys = Object.keys(selectElement);
    for (const elementKey of elementKeys) {
      registryAction.deleteElement(elementKey);
    }
    selectAction.resetElement();
  };

  return {
    deleteState: {
      isActivate,
      menuPosition,
    },
    deleteAction: {
      handleOnClick,
    },
  };
}

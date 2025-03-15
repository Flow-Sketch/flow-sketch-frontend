import React, { useEffect, useState } from 'react';
import { SelectManagerAction } from '@/hooks/canvas/useCanvasSelectElementManager.ts';
import { ElementRegistryAction } from '@/hooks/canvas/useCanvasElementManager.ts';
import { useElementRegistryStore } from '@/store';

export type DeleteManagerState = {
  isActivate: boolean;
  menuPosition: {
    x: number;
    y: number;
  } | null;
};

export type DeleteManagerAction = {
  handleOnClick: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLCanvasElement>) => void;
};

export function useCanvasDeleteElementManager(
  selectAction: SelectManagerAction,
  registryAction: ElementRegistryAction,
): {
  deleteState: DeleteManagerState;
  deleteAction: DeleteManagerAction;
} {
  const userId = 'testUser';
  const [isActivate] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const selectState = useElementRegistryStore((store) => store.selectElement[userId]);

  useEffect(() => {
    setMenuPosition({
      x: selectState.boundingBox.cx,
      y: selectState.boundingBox.cy - selectState.boundingBox.height / 2 + 20,
    });
  }, [selectState.boundingBox.width, selectState.boundingBox.height]);

  const deleteElement = () => {
    const { elements } = selectState;
    const elementKeys = Object.keys(elements);
    for (const elementKey of elementKeys) {
      registryAction.deleteElement(elementKey);
    }
    selectAction.resetElement();
  };

  const handleOnClick = () => {
    deleteElement();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!event) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteElement();
    }
  };

  return {
    deleteState: {
      isActivate,
      menuPosition,
    },
    deleteAction: {
      handleOnClick,
      handleKeyDown,
    },
  };
}

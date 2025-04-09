import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ElementRegistryAction } from '@/features/sketch/hooks/useElementRegistry.ts';
import { useElementRegistryStore } from '@/core/stores';
import { SelectManagerAction } from '@/features/sketch/hooks/useSelectElementManager.ts';
import { BaseSketchElement } from '@/core/models/sketchElement';

export type ClipboardManagerAction = {
  handleCopyElement: () => void;
  handlePasteElement: () => void;
  handleCutElement: () => void;
};

export function useClipboardElementManager(
  selectAction: SelectManagerAction,
  elementRegistryAction: ElementRegistryAction,
): {
  clipboardAction: ClipboardManagerAction;
} {
  const userId = 'testUser';
  const [clipboards, setClipboard] = useState<BaseSketchElement[] | null>(null);
  const allElements = useElementRegistryStore((store) => store.elementRegistry);
  const selectState = useElementRegistryStore((store) => store.selectElements[userId]);

  const handleCopyElement = () => {
    const currentSelectElementKeys = Object.keys(selectState.elements);
    if (currentSelectElementKeys.length === 0) return;

    const selectElements = currentSelectElementKeys.reduce((current, elementId) => {
      const currentElement = allElements.elements[elementId];
      if (currentElement) {
        return [...current, allElements.elements[elementId]];
      } else {
        return current;
      }
    }, [] as BaseSketchElement[]);

    setClipboard(selectElements);
  };

  const handlePasteElement = () => {
    if (!clipboards) return;

    // 0. 새로운 id 를 생성
    const newElements = [];
    const newElementIds: string[] = [];

    for (const clip of clipboards) {
      const newId = uuidv4();
      newElementIds.push(newId);
      newElements.push({ ...clip, id: newId, x: clip.x + 30, y: clip.y + 30 });
    }

    // 1. 새로운 객체 생성
    elementRegistryAction.createElements(newElements);

    // 2. 새롭게 생성된 객체의 id 를 업데이트 -> 복사/붙여넣기 시, 자동선택되게 함
    selectAction.handleUpdateSelectId(newElementIds);
  };

  const handleCutElement = () => {
    const currentSelectElementKeys = Object.keys(selectState.elements);
    if (!currentSelectElementKeys.length) return;

    const selectElements = currentSelectElementKeys.reduce((current, elementId) => {
      if (allElements.elements[elementId]) {
        return [...current, allElements.elements[elementId]];
      } else {
        return current;
      }
    }, [] as BaseSketchElement[]);

    setClipboard(selectElements);
    elementRegistryAction.deleteElements(currentSelectElementKeys);
  };

  return {
    clipboardAction: {
      handleCopyElement,
      handleCutElement,
      handlePasteElement,
    },
  };
}

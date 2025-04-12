import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ElementRegistryAction } from '@/features/sketch/hooks/useSketchElementRegistry.ts';
import { SelectManagerAction } from '@/features/sketch/hooks/useSelectElementManager.ts';
import { useSketchCameraViewStore, useSketchElementRegistryStore } from '@/core/stores';
import { BaseSketchElement } from '@/core/models/sketchElement';
import { OnlyClassProperties } from '@/shared/utils/common';
import { getBoundingBox } from '@/shared/utils/boundingBox';
import { convertSelectBoxList } from '@/features/sketch/utils';

export type ClipboardManagerAction = {
  handleCopyElement: () => void;
  handlePasteElement: () => void;
  handleCutElement: () => void;
  handlePasteElementAtPosition: (point: { cx: number; cy: number }) => void;
};

export function useClipboardElementManager(
  selectAction: SelectManagerAction,
  elementRegistryAction: ElementRegistryAction,
): {
  clipboardAction: ClipboardManagerAction;
} {
  const userId = 'testUser';
  const [clipboards, setClipboard] = useState<OnlyClassProperties<BaseSketchElement>[] | null>(null);

  const viewState = useSketchCameraViewStore();
  const allElements = useSketchElementRegistryStore((store) => store.elementRegistry);
  const selectStateIds = useSketchElementRegistryStore((store) => store.selectElements[userId].selectElementIds);

  const handleCopyElement = () => {
    if (selectStateIds.length === 0) return;

    const selectElements = selectStateIds.reduce((current, elementId) => {
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
    const newElementIds: string[] = [];
    const newElements: OnlyClassProperties<BaseSketchElement>[] = [];

    for (const clip of clipboards) {
      const newId = uuidv4();
      newElementIds.push(newId);
      newElements.push({ ...clip, id: newId, x: clip.x + 30, y: clip.y + 30 });
    }

    // 1. 새로운 객체 생성
    elementRegistryAction.createElements(newElements);

    // 2. 새롭게 생성된 객체의 id 를 업데이트 -> 복사/붙여넣기 시, 자동선택되게 함
    selectAction.handleManualSelectIds(newElementIds);

    // 3. clipBoard 에 새롭게 객체 업데이트
    setClipboard(newElements);
  };

  const handlePasteElementAtPosition = (
    pastePoint: { cx: number; cy: number }, // view 좌표
  ) => {
    if (!clipboards) return;

    // clipboard 에 저장된 elements 들의 boundingBox (view 좌표계)
    const selectBoxList = convertSelectBoxList(clipboards, viewState);
    const boundingBox = getBoundingBox(
      selectBoxList.map((clip) => ({
        cx: clip.viewX,
        cy: clip.viewY,
        width: clip.width,
        height: clip.height,
        rotation: clip.rotation,
      })),
    );

    // paste 지점과 복사 지점과의 벡터를 구한 후 절대좌표계 단위로 변환
    const deltaX = (pastePoint.cx - boundingBox.cx) / viewState.scale;
    const deltaY = (pastePoint.cy - boundingBox.cy) / viewState.scale;

    // 0. 새로운 id 를 생성
    const newElementIds: string[] = [];
    const newElements: OnlyClassProperties<BaseSketchElement>[] = [];

    for (const clip of clipboards) {
      const newId = uuidv4();
      newElementIds.push(newId);
      newElements.push({ ...clip, id: newId, x: clip.x + deltaX, y: clip.y + deltaY });
    }

    // 1. 새로운 객체 생성
    elementRegistryAction.createElements(newElements);

    // 2. 새롭게 생성된 객체의 id 를 업데이트 -> 복사/붙여넣기 시, 자동선택되게 함
    selectAction.handleManualSelectIds(newElementIds);

    // 3. clipBoard 에 새롭게 객체 업데이트
    setClipboard(newElements);
  };

  const handleCutElement = () => {
    if (!selectStateIds.length) return;

    const selectElements = selectStateIds.reduce((current, elementId) => {
      if (allElements.elements[elementId]) {
        return [...current, allElements.elements[elementId]];
      } else {
        return current;
      }
    }, [] as BaseSketchElement[]);

    setClipboard(selectElements);
    elementRegistryAction.deleteElements(selectStateIds);
  };

  return {
    clipboardAction: {
      handlePasteElementAtPosition,
      handleCopyElement,
      handleCutElement,
      handlePasteElement,
    },
  };
}

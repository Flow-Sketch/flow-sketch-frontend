import { useState } from 'react';
import { Point } from '@/shared/utils/collidingDetection';
import { SelectManagerState } from '@/features/sketch/hooks/useSelectElementManager.ts';
import { ElementRegistry } from '@/core/models/sketchFile';

export interface CreateLineManagerState {
  dragElement: {
    startPoint: Point | null;
    endPoint: Point | null;
  };
}

export interface CreateLineManagerAction {
  handleStartLineCreation: () => void;
  handleUpdateLineEndPosition: () => void;
  handleFinalizeLineCreation: () => void;
}

export function useCreateLineManager(
  elementRegistry: ElementRegistry,
  selectState: SelectManagerState,
): {
  createLineState: CreateLineManagerState;
  createLineAction: CreateLineManagerAction;
} {
  const [startPoint, setStartPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 위치
  const [endPoint, setEndPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 놓은 순간의 위치

  // 마우스 클릭 시 시작 point 를 업데이트
  const handleStartLineCreation = () => {};

  // 마우스를 움직이는 동안 마지막 point 를 옮김
  const handleUpdateLineEndPosition = () => {};

  // 마우스 클릭을 놓았을 때 최종 점의 끝 point 를 업데이트
  const handleFinalizeLineCreation = () => {};

  return {
    createLineState: {
      dragElement: {
        startPoint,
        endPoint,
      },
    },
    createLineAction: {
      handleStartLineCreation,
      handleUpdateLineEndPosition,
      handleFinalizeLineCreation,
    },
  };
}

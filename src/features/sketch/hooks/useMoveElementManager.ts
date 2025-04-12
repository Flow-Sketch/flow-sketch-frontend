import * as React from 'react';
import { MouseEvent, useState } from 'react';
import { ElementRegistryAction, SelectManagerState } from '@/features/sketch/hooks/index.ts';
import { TRANSFORM_CONTROL_SIDE_WIDTH } from '@/features/sketch/constants';
import { useCanvasViewStore } from 'src/core/stores';
import { isPointInOBB } from '@/shared/utils/collidingDetection';

export type MoveManagerState = {
  isMoving: boolean;
};

export type MoveManagerAction = {
  handleStartElementMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleUpdateElementPosition: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleFinalizeElementMove: () => void;
};

export function useMoveElementManager(
  selectState: SelectManagerState,
  elementRegistryAction: ElementRegistryAction,
): {
  moveState: MoveManagerState;
  moveAction: MoveManagerAction;
} {
  const viewState = useCanvasViewStore();
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [alignmentPoint, setAlignmentPoint] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 지정

  const handleStartElementMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!event || !selectState.boundingBox) return;

    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    const { cx, cy, width, height } = selectState.boundingBox;
    const isPointInBox = isPointInOBB(
      { cx, cy, width: width - TRANSFORM_CONTROL_SIDE_WIDTH, height: height - TRANSFORM_CONTROL_SIDE_WIDTH, rotation: 0 },
      { x: currentX, y: currentY },
    );

    // 여기에 마우스 포인터위치를 통해서 move 영역에 해당되면 이동
    if (isPointInBox) {
      const newStartPosition = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setAlignmentPoint(newStartPosition);
      setIsMoving(true);
    }
  };

  const handleUpdateElementPosition = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isMoving || !alignmentPoint) return;

    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    const deltaX = (currentX - alignmentPoint.x) / viewState.scale;
    const deltaY = (currentY - alignmentPoint.y) / viewState.scale;

    // 선택된 요소를 같은 크기로 이동시킴
    for (const selectKey of selectState.selectElements) {
      elementRegistryAction.moveElement(selectKey, { moveX: deltaX, moveY: deltaY });
    }
    setAlignmentPoint({ x: currentX, y: currentY });
  };

  const handleFinalizeElementMove = () => {
    if (!isMoving || !alignmentPoint) return;

    setIsMoving(false);
    setAlignmentPoint(null);
  };

  return {
    moveState: {
      isMoving,
    },
    moveAction: {
      handleStartElementMove,
      handleUpdateElementPosition,
      handleFinalizeElementMove,
    },
  };
}

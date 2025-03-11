import { MouseEvent, useState } from 'react';
import { isPointInOBB } from '@/utils/collidingDetection';
import { TRANSFORM_CONTROL_SIDE_WIDTH } from '@/constants';
import { SelectManagerState } from '@/hooks/canvas/useCanvasSelectManager.ts';
import { ElementRegistryAction } from '@/hooks/canvas/useCanvasElementManager.ts';
import { ViewManagerState } from '@/hooks/canvas/useCanvasViewManager.ts';
import * as React from 'react';

export type MoveManagerAction = {
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
};

export function useCanvasMoveElementManager(
  viewState: ViewManagerState,
  selectState: SelectManagerState,
  elementRegistryAction: ElementRegistryAction,
): {
  moveAction: MoveManagerAction;
} {
  const [alignmentPoint, setAlignmentPoint] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 지정
  const [isDrawing, setDrawing] = useState<boolean>(false);

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

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
      setDrawing(true);
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isDrawing || !alignmentPoint) return;

    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    const deltaX = (currentX - alignmentPoint.x) / viewState.scale;
    const deltaY = (currentY - alignmentPoint.y) / viewState.scale;

    // 선택된 요소를 같은 크기로 이동시킴
    for (const selectKey of Object.keys(selectState.selectElement)) {
      elementRegistryAction.moveElement(selectKey, { moveX: deltaX, moveY: deltaY });
    }
    setAlignmentPoint({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !alignmentPoint) return;

    setDrawing(false);
    setAlignmentPoint(null);
  };

  return {
    moveAction: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    },
  };
}

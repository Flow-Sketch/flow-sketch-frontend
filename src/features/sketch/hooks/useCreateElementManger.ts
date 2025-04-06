import * as React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ShapeType, useCanvasRemoteStore, useCanvasViewStore } from '@/stores';
import { ElementRegistryAction } from '@/features/sketch/hooks/useElementRegistry.ts';
import { RemoteManagerAction } from '@/features/sketch/hooks/useRemoteManager.ts';

export type CreateElementManagerState = {
  guideBox: {
    startPoint: { x: number; y: number } | null;
    endPoint: { x: number; y: number } | null;
  };
  shapeType: ShapeType;
};

export type CreateElementMangerAction = {
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
};

export function useCreateElementManger(
  remoteAction: RemoteManagerAction,
  elementRegistryAction: ElementRegistryAction,
): {
  createState: CreateElementManagerState;
  createAction: CreateElementMangerAction;
} {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 위치
  const [endPoint, setEndPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 놓은 순간의 위치
  const shapeType = useCanvasRemoteStore((store) => store.shapeType);
  const setShapeType = remoteAction.handleShapeTypeChange;
  const viewState = useCanvasViewStore();

  /**
   * > 도형을 그릴 때 처음 point(좌측 상단)
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    setIsDrawing(true);
    setStartPosition({
      x: currentX,
      y: currentY,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isDrawing || !startPoint) return;

    setEndPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !endPoint || !shapeType) return;

    const convertWidth = Math.abs(endPoint.x - startPoint.x) / viewState.scale;
    const convertHeight = Math.abs(endPoint.y - startPoint.y) / viewState.scale;
    const convertOffsetX = (Math.abs(viewState.offset.x) + Math.min(startPoint.x, endPoint.x)) / viewState.scale; // View 좌표계 -> 절대 좌표계로 변경
    const convertOffsetY = (Math.abs(viewState.offset.y) + Math.min(startPoint.y, endPoint.y)) / viewState.scale; // View 좌표계 -> 절대 좌표계로 변경

    elementRegistryAction.createElement(shapeType, {
      id: uuidv4(),
      width: convertWidth,
      height: convertHeight,
      x: convertOffsetX + convertWidth / 2,
      y: convertOffsetY + convertHeight / 2,
    });

    setShapeType([null]);
    setIsDrawing(false);
    setStartPosition(null);
    setEndPosition(null);
  };

  return {
    createState: {
      guideBox: {
        startPoint,
        endPoint,
      },
      shapeType,
    },
    createAction: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    },
  };
}

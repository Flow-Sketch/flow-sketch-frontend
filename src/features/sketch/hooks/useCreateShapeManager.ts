import * as React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ShapeType, useSketchRemoteStore, useSketchCameraViewStore } from 'src/core/stores';
import { ElementRegistryAction } from '@/features/sketch/hooks/useSketchElementRegistry.ts';
import { RemoteManagerAction } from '@/features/sketch/hooks/useRemoteManager.ts';
import { isShapeType } from '@/features/sketch/utils';

export type CreateElementManagerState = {
  guideBox: {
    startPoint: { x: number; y: number } | null;
    endPoint: { x: number; y: number } | null;
  };
  shapeType: ShapeType;
};

export type CreateElementManagerAction = {
  // end
  handleStartElementCreation: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleUpdateElementSize: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleFinalizeElementCreation: () => void;
  handleCancelElementCreation: () => void;
};

export function useCreateShapeManager(
  remoteAction: RemoteManagerAction,
  elementRegistryAction: ElementRegistryAction,
): {
  createState: CreateElementManagerState;
  createAction: CreateElementManagerAction;
} {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 클릭한 순간의 위치
  const [endPoint, setEndPosition] = useState<{ x: number; y: number } | null>(null); // 마우스를 놓은 순간의 위치

  const viewState = useSketchCameraViewStore();
  const shapeType = useSketchRemoteStore((store) => store.shapeType);
  const setShapeType = remoteAction.handleShapeTypeChange;

  /**
   * > 도형을 그릴 때 처음 point(좌측 상단)
   */
  const handleStartElementCreation = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    setIsDrawing(true);
    setStartPosition({
      x: currentX,
      y: currentY,
    });
  };

  const handleUpdateElementSize = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isDrawing || !startPoint) return;
    setEndPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  const handleFinalizeElementCreation = () => {
    if (!isDrawing || !startPoint || !endPoint) return;
    if (!isShapeType(shapeType)) return;

    const convertWidth = Math.abs(endPoint.x - startPoint.x) / viewState.scale;
    const convertHeight = Math.abs(endPoint.y - startPoint.y) / viewState.scale;
    const convertOffsetX = (Math.abs(viewState.offset.x) + Math.min(startPoint.x, endPoint.x)) / viewState.scale; // View 좌표계 -> 절대 좌표계로 변경
    const convertOffsetY = (Math.abs(viewState.offset.y) + Math.min(startPoint.y, endPoint.y)) / viewState.scale; // View 좌표계 -> 절대 좌표계로 변경

    elementRegistryAction.createSingleElement({
      id: uuidv4(),
      type: shapeType,
      width: convertWidth,
      height: convertHeight,
      x: convertOffsetX + convertWidth / 2,
      y: convertOffsetY + convertHeight / 2,
      initPoints: null,
    });

    handleCancelElementCreation();
  };

  const handleCancelElementCreation = () => {
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
      handleStartElementCreation,
      handleUpdateElementSize,
      handleFinalizeElementCreation,
      handleCancelElementCreation,
    },
  };
}

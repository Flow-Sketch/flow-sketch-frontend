import * as React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isLineType } from '@/features/sketch/utils';
import { Point } from '@/shared/utils/collidingDetection';
import { useSketchCameraViewStore, useSketchRemoteStore } from '@/core/stores';
import { RemoteManagerAction } from '@/features/sketch/hooks/useRemoteManager.ts';
import { ElementRegistryAction } from '@/features/sketch/hooks/useSketchElementRegistry.ts';

export interface CreateLineManagerState {
  dragElement: {
    startPoint: Point | null;
    endPoint: Point | null;
  };
}

export interface CreateLineManagerAction {
  handleStartLineCreation: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleUpdateLineEndPosition: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleFinalizeLineCreation: () => void;
  handleCancelLineCreation: () => void;
}

export function useCreateLineManager(
  remoteAction: RemoteManagerAction,
  elementRegistryAction: ElementRegistryAction,
): {
  createLineState: CreateLineManagerState;
  createLineAction: CreateLineManagerAction;
} {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPosition] = useState<Point | null>(null); // 마우스를 클릭한 순간의 위치
  const [endPoint, setEndPosition] = useState<Point | null>(null); // 마우스를 놓은 순간의 위치

  const viewState = useSketchCameraViewStore();
  const shapeType = useSketchRemoteStore((store) => store.shapeType);
  const setShapeType = remoteAction.handleShapeTypeChange;

  // 마우스 클릭 시 시작 point 를 업데이트
  const handleStartLineCreation = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    setIsDrawing(true);
    setStartPosition({
      x: currentX,
      y: currentY,
    });
  };

  // 마우스를 움직이는 동안 마지막 point 를 옮김
  const handleUpdateLineEndPosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isDrawing || !startPoint) return;
    setEndPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  // 마우스 클릭을 놓았을 때 최종 점의 끝 point 를 업데이트
  const handleFinalizeLineCreation = () => {
    if (!isDrawing || !startPoint || !endPoint) return;
    if (!isLineType(shapeType)) return;

    console.log(viewState, startPoint);

    const convertWidth = Math.abs(endPoint.x - startPoint.x) / viewState.scale;
    const convertHeight = Math.abs(endPoint.y - startPoint.y) / viewState.scale;
    const convertOffsetX = (Math.abs(viewState.offset.x) + Math.min(startPoint.x, endPoint.x)) / viewState.scale; // View 좌표계 -> 절대 좌표계로 변경
    const convertOffsetY = (Math.abs(viewState.offset.y) + Math.min(startPoint.y, endPoint.y)) / viewState.scale; // View 좌표계 -> 절대 좌표계로 변경
    const convertStartPoint = {
      x: (Math.abs(viewState.offset.x) + startPoint.x) / viewState.scale,
      y: (Math.abs(viewState.offset.y) + startPoint.y) / viewState.scale,
    };
    const convertEndPoint = {
      x: (Math.abs(viewState.offset.x) + endPoint.x) / viewState.scale,
      y: (Math.abs(viewState.offset.y) + endPoint.y) / viewState.scale,
    };

    elementRegistryAction.createSingleElement({
      id: uuidv4(),
      type: shapeType,
      width: convertWidth,
      height: convertHeight,
      x: convertOffsetX + convertWidth / 2,
      y: convertOffsetY + convertHeight / 2,
      points: [convertStartPoint, convertEndPoint],
      elementStyle: {
        borderWidth: 2,
        borderColor: '#000000',
      },
    });

    // 상태 관련 리셋
    handleCancelLineCreation();
  };

  const handleCancelLineCreation = () => {
    setShapeType([null]);
    setIsDrawing(false);
    setStartPosition(null);
    setEndPosition(null);
  };

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
      handleCancelLineCreation,
    },
  };
}

import { getArrayFirst, getArrayLast, OnlyClassProperties } from '@/shared/utils/common';
import { SketchElement } from '@/core/models/sketchElement';
import { Point } from '@/shared/utils/collidingDetection';
import { ViewState } from '@/core/stores';
import { LineType } from '@/core/models/sketchElement/LineSketchElement.ts';

export interface BoundingLine {
  startPoint: Point;
  endPoint: Point;
  cx: number;
  cy: number;
  rotation: number;
  length: number;
}

export function convertSelectLine(
  lineElement: OnlyClassProperties<SketchElement<LineType>>,
  viewState: ViewState,
): BoundingLine | undefined {
  if (lineElement.pointIds.length < 2) {
    console.error('잘못된 line Element');
    return;
  }
  const scale = viewState.scale;
  const offsetX = viewState.offset.x;
  const offsetY = viewState.offset.y;
  const convertPoint: Point[] = lineElement.pointIds.map((pointId) => {
    const pointInfo = lineElement.points[pointId];
    const viewX = offsetX + scale * pointInfo.x;
    const viewY = offsetY + scale * pointInfo.y;
    return {
      x: viewX,
      y: viewY,
    };
  });

  const startPoint = getArrayFirst(convertPoint);
  const endPoint = getArrayLast(convertPoint);
  if (!startPoint || !endPoint) {
    throw new Error('convertSelectLine Error : 잘못된 시작점 혹은 끝점의 값');
  }

  // 중심점 계산
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const cx = (startPoint.x + endPoint.x) / 2;
  const cy = (startPoint.y + endPoint.y) / 2;
  const length = Math.sqrt(dx * dx + dy * dy);

  // 각도 계산 (라디안) Math.atan2는 -π에서 π 사이의 값을 반환
  const rotation = Math.atan2(dy, dx);

  return {
    startPoint: startPoint,
    endPoint: endPoint,
    cx,
    cy,
    rotation,
    length,
  };
}

import { Point } from '@/shared/utils/collidingDetection';
import { BaseSketchElement, BaseSketchElementParams } from '@/core/models/sketchElement/BaseSketchElement.ts';
import { getArrayFirst, getArrayLast } from '@/shared/utils/common';

export type LineType = 'line';

export type ElementPoint = Point & { id: string };

export interface LineSketchElementParams extends Omit<BaseSketchElementParams<LineType>, 'initPoints'> {
  initPoints: Point[];
  type: LineType;
}

/**
 * ### ‼️증요
 * > LineElement 는 무조건 points 로 시작해야 함
 */
export class LineSketchElement extends BaseSketchElement<LineType> {
  points: Record<string, ElementPoint>; // points 네로잉
  pointIds: string[];

  constructor(props: LineSketchElementParams) {
    super(props);
    const { convertIds, convertPoint } = this._convertLinePoint(props.initPoints);
    this.points = convertPoint;
    this.pointIds = convertIds;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.points) return;

    ctx.save();

    // 스타일 적용
    ctx.lineWidth = this.elementStyle.borderWidth ?? 2;
    ctx.strokeStyle = this.elementStyle.borderColor ?? 'transparent';

    // Line 회전
    ctx.translate(this.x, this.y); // 회전하고자 하는 평면의 중점을 x, y  로 이동
    ctx.rotate(this.rotation); // 중점에서 좌표평면을 `rotation` 만큼 회전
    ctx.translate(-this.x, -this.y); // 다시 좌표평면의 위치를 x, y 로 이동

    // Line 그리기
    ctx.beginPath();
    this.pointIds.forEach((pointId, id) => {
      const linePoint = this.points[pointId];
      if (id === 0) return ctx.lineTo(linePoint.x, linePoint.y);
      ctx.lineTo(linePoint.x, linePoint.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  changePoint(dx: number, dy: number, directions: 'point-start' | 'point-end') {
    const startPointId = getArrayFirst(this.pointIds);
    const endPointId = getArrayLast(this.pointIds);

    if (!startPointId || !endPointId) {
      throw new Error('changePoint Error');
    }

    const startPoint = this.points[startPointId];
    const endPoint = this.points[endPointId];

    // 포인트 위치 업데이트
    if (directions === 'point-start') {
      this.points[startPointId] = {
        ...startPoint,
        x: startPoint.x + dx,
        y: startPoint.y + dy,
      };
    } else {
      this.points[endPointId] = {
        ...endPoint,
        x: endPoint.x + dx,
        y: endPoint.y + dy,
      };
    }

    // 업데이트된 포인트 가져오기
    const updatedStartPoint = this.points[startPointId];
    const updatedEndPoint = this.points[endPointId];

    // 엘리먼트 크기 및 위치 계산
    const minX = Math.min(updatedStartPoint.x, updatedEndPoint.x);
    const maxX = Math.max(updatedStartPoint.x, updatedEndPoint.x);
    const minY = Math.min(updatedStartPoint.y, updatedEndPoint.y);
    const maxY = Math.max(updatedStartPoint.y, updatedEndPoint.y);

    // 엘리먼트 속성 업데이트
    this.width = maxX - minX;
    this.height = maxY - minY;
    this.x = minX + this.width / 2; // 중심점 X
    this.y = minY + this.height / 2; // 중심점 Y
  }

  /**
   * @remarks
   * - Shape(도형)과는 다른 `resize` 메소드 필요
   * - `BaseSketchElement` 의 `resize` 메소드 오버라이딩
   */
  resize(dx: number, dy: number, directions: ('top' | 'right' | 'bottom' | 'left')[]) {
    console.log(dx, dy, directions);
  }
}

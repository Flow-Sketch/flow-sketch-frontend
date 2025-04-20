import { Point } from '@/shared/utils/collidingDetection';
import { BaseSketchElement, BaseSketchElementParams } from '@/core/models/sketchElement/BaseSketchElement.ts';

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

  /**
   * @remarks
   * - Shape(도형)과는 다른 `resize` 메소드 필요
   * - `BaseSketchElement` 의 `resize` 메소드 오버라이딩
   */
  resize(dx: number, dy: number, directions: ('top' | 'right' | 'bottom' | 'left')[]) {
    console.log(dx, dy, directions);
  }
}

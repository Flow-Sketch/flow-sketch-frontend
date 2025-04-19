import { Point } from '@/shared/utils/collidingDetection';
import { BaseSketchElement, BaseSketchElementParams } from '@/core/models/sketchElement/BaseSketchElement.ts';

export type LineType = 'line';

export interface LineSketchElementParams extends Omit<BaseSketchElementParams<LineType>, 'points'> {
  points: Point[];
  type: LineType;
}

/**
 * ### ‼️증요
 * > LineElement 는 무조건 points 로 시작해야 함
 */
export class LineSketchElement extends BaseSketchElement<LineType> {
  points: Point[]; // points 네로잉

  constructor(props: LineSketchElementParams) {
    super(props);
    this.points = props.points;
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
    this.points.forEach((linePoint, id) => {
      if (id === 0) return ctx.lineTo(linePoint.x, linePoint.y);
      ctx.lineTo(linePoint.x, linePoint.y);
    });
    ctx.stroke();
    ctx.restore();
  }
}

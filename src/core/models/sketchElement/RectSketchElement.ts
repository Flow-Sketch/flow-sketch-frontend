import { BaseSketchElement, BaseSketchElementParams } from '@/core/models/sketchElement/BaseSketchElement.ts';

export type RectType = 'rect';

export interface RectSketchElementParams extends BaseSketchElementParams<RectType> {
  type: RectType;
  rotation?: number;
}

export class RectSketchElement extends BaseSketchElement<RectType> {
  constructor(params: RectSketchElementParams) {
    super({ ...params, initPoints: null });
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 스타일 적용
    ctx.lineWidth = this.elementStyle.borderWidth ?? 2;
    ctx.strokeStyle = this.elementStyle.borderColor ?? 'transparent';
    ctx.fillStyle = this.elementStyle.background ?? 'transparent';

    // 사각형 회전
    ctx.translate(this.x, this.y); // 회전하고자 하는 평면의 중점을 x, y  로 이동
    ctx.rotate(this.rotation); // 중점에서 좌표평면을 `rotation` 만큼 회전
    ctx.translate(-this.x, -this.y); // 다시 좌표평면의 위치를 x, y 로 이동

    // 사각형 그리기
    ctx.beginPath(); // 다른 도형들과 분리되어 독립적으로 처리
    ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/** ### `rect()` 사용법
 * ctx.rect(
 *   x,      // 사각형의 시작 X 좌표 (좌측 상단 기준)
 *   y,      // 사각형의 시작 Y 좌표 (좌측 상단 기준)
 *   width,  // 사각형의 너비
 *   height, // 사각형의 높이
 * );
 */

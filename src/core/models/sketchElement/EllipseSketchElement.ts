import { BaseSketchElement } from '@/core/models/sketchElement/BaseSketchElement.ts';

export interface EllipseSketchElementParams {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation?: number;
}

export class EllipseSketchElement extends BaseSketchElement {
  constructor(params: EllipseSketchElementParams) {
    super({
      id: params.id,
      type: 'ellipse',
      width: params.width,
      height: params.height,
      x: params.x,
      y: params.y,
      rotation: params.rotation ? params.rotation : 0, // 최초 생성 시, rotation 은 0 으로 시작
      elementStyle: {
        borderWidth: 2,
        background: '#dfdfdf',
        borderColor: '#000000',
      },
    });
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 스타일 적용
    ctx.lineWidth = this.elementStyle.borderWidth ?? 2;
    ctx.strokeStyle = this.elementStyle.borderColor ?? '#000';
    ctx.fillStyle = this.elementStyle.background ?? 'transparent';

    //  원 회전
    ctx.translate(this.x, this.y); // 회전하고자 하는 평면의 중점을 x, y  로 이동
    ctx.rotate(this.rotation); // 중점에서 좌표평면을 `rotation` 만큼 회전
    ctx.translate(-this.x, -this.y); // 다시 좌표평면의 위치를 x, y 로 이동

    // 타원(원) 그리기
    ctx.beginPath(); // 다른 도형들과 분리되어 독립적으로 처리
    ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/** ### `ellipse()` 사용법
 * ctx.ellipse(
 *   x,            // 타원의 중심 X 좌표
 *   y,            // 타원의 중심 Y 좌표
 *   radiusX,      // X축 방향 반지름
 *   radiusY,      // Y축 방향 반지름
 *   rotation,     // 타원의 회전각 (라디안 단위)
 *   startAngle,   // 타원 호 그리기의 시작 각도 (라디안)
 *   endAngle,     // 타원 호 그리기의 끝 각도 (라디안)
 *   anticlockwise // (선택적) true면 반시계방향, false면 시계방향 (기본값: false)
 * );
 */

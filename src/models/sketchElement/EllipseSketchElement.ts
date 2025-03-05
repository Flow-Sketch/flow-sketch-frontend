import { BaseSketchElement } from '@/models/sketchElement/BaseSketchElement.ts';

interface EllipseSketchElementParams {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class EllipseSketchElement extends BaseSketchElement {
  constructor(id: string, params: EllipseSketchElementParams) {
    super({
      id,
      type: 'ellipse',
      width: params.width,
      height: params.height,
      x: params.x,
      y: params.y,
      rotation: 0, // 최초 생성 시, rotation 은 0 으로 시작
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

    // 타원(원) 그리기
    ctx.beginPath(); // 다른 도형들과 분리되어 독립적으로 처리
    ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 편집가능 시 형태 그리기
    if (this.isEditable) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'blue';
      ctx.stroke();
    }
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

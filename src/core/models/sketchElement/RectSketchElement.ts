import { BaseSketchElement } from '@/core/models/sketchElement/BaseSketchElement.ts';

export type RectType = 'rect';

export interface RectSketchElementParams {
  type: RectType;
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation?: number;
  background?: string;
}

export class RectSketchElement extends BaseSketchElement {
  constructor(params: RectSketchElementParams) {
    super({
      id: params.id,
      type: params.type,
      width: params.width,
      height: params.height,
      x: params.x,
      y: params.y,
      rotation: params.rotation ? params.rotation : 0, // 최초 생성 시, rotation 은 0 으로 시작
      elementStyle: {
        borderWidth: 2,
        background: params.background ? params.background : '#dfdfdf',
        borderColor: '#000000',
      },
    });
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

    // 글자 작성
    ctx.font = '80px';
    ctx.fillStyle = 'black';
    ctx.fillText(`x : ${this.x}, y : ${this.y}`, this.x, this.y);
    ctx.fillText(`x : ${this.width}, y : ${this.height}`, this.x, this.y + 20);
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

import { BaseSketchElement } from '@/models/sketchElement/BaseSketchElement.ts';

interface RectSketchElementParams {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class RectSketchElement extends BaseSketchElement {
  constructor(id: string, params: RectSketchElementParams) {
    super(id, 'rect', params.width, params.height, params.x, params.y, {
      borderWidth: 2,
      background: '#dfdfdf',
      borderColor: '#000000',
    });
  }
  draw(ctx: CanvasRenderingContext2D) {
    // 스타일 적용
    ctx.save();
    ctx.lineWidth = this.elementStyle.borderWidth ?? 2;
    ctx.strokeStyle = this.elementStyle.borderColor ?? '#000';
    ctx.fillStyle = this.elementStyle.background ?? 'transparent';

    // 사각형 그리기
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

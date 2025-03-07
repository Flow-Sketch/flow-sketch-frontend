interface BaseSelectBoxParams {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number; //상대좌표계 사용
  offsetY: number; //상대좌표계 사용
  rotation: number;
  scale: number;
}

export class BaseSelectBox {
  id: string;

  /** 객체의 중심점의 x 좌표
   */
  viewX: number;

  /** 객체의 중심점의 y 좌표
   */
  viewY: number;
  width: number;
  height: number;
  rotation: number; // 단위 : 라디안(360도 === 2 * PI)
  scale: number;

  constructor(param: BaseSelectBoxParams) {
    const { viewX, viewY, height, width } = this.convertAxis(param);
    this.id = param.id;
    this.viewX = viewX;
    this.viewY = viewY;
    this.width = width;
    this.height = height;
    this.scale = param.scale;
    this.rotation = param.rotation;
  }

  private convertAxis({ x, y, width, height, offsetX, offsetY, rotation, scale }: Omit<BaseSelectBoxParams, 'id'>) {
    // 절대 좌표를 View 좌표로 변환
    const viewX = offsetX + scale * x;
    const viewY = offsetY + scale * y;

    // 회전된 사각형의 너비와 높이 계산
    const rotatedWidth = width * scale * Math.cos(rotation);
    const rotatedHeight = height * scale * Math.cos(Math.PI - rotation);

    return {
      viewX,
      viewY,
      width: rotatedWidth,
      height: rotatedHeight,
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 스타일 적용
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'transparent';

    // 사각형 그리기
    ctx.beginPath(); // 다른 도형들과 분리되어 독립적으로 처리
    ctx.rect(this.viewX - this.width / 2, this.viewY - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

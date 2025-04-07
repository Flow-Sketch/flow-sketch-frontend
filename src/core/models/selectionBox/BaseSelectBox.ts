import { colorToken } from '@/shared/styles/color';

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

  private convertAxis({ x, y, width, height, offsetX, offsetY, scale }: Omit<BaseSelectBoxParams, 'id' | 'rotation'>) {
    // 절대 좌표를 View 좌표로 변환
    const viewX = offsetX + scale * x;
    const viewY = offsetY + scale * y;

    // 회전된 사각형의 너비와 높이 계산
    const rotatedWidth = width * scale;
    const rotatedHeight = height * scale;

    return {
      viewX,
      viewY,
      width: rotatedWidth,
      height: rotatedHeight,
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const resizeAnchorWidth = 8; // 앵커의 길이
    const resizeAnchorRadius = 2; // 모서리 반경 설정
    const resizeAnchorPosition = [
      { x: this.viewX - this.width / 2, y: this.viewY - this.height / 2 }, // 왼쪽 상단
      { x: this.viewX - this.width / 2, y: this.viewY + this.height / 2 }, // 왼쪽 하단
      { x: this.viewX + this.width / 2, y: this.viewY - this.height / 2 }, // 오른쪽 상단
      { x: this.viewX + this.width / 2, y: this.viewY + this.height / 2 }, // 오른쪽 하단
    ];

    // 스타일 적용
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorToken['focusColor'];
    ctx.fillStyle = 'transparent';

    // 회전축 변경
    ctx.translate(this.viewX, this.viewY); // 회전하고자 하는 평면의 중점을 x, y  로 이동
    ctx.rotate(this.rotation); // 중점에서 좌표평면을 `rotation` 만큼 회전
    ctx.translate(-this.viewX, -this.viewY); // 다시 좌표평면의 위치를 x, y 로 이동

    // 사각형 그리기
    ctx.beginPath(); // 다른 도형들과 분리되어 독립적으로 처리
    ctx.rect(this.viewX - this.width / 2, this.viewY - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // 앵커 사각형 그리기
    for (const anchorPosition of resizeAnchorPosition) {
      const { x, y } = anchorPosition;
      ctx.lineWidth = 3;
      ctx.strokeStyle = colorToken['focusColor'];
      ctx.fillStyle = colorToken['white'];

      ctx.beginPath();
      ctx.roundRect(x - resizeAnchorWidth / 2, y - resizeAnchorWidth / 2, resizeAnchorWidth, resizeAnchorWidth, resizeAnchorRadius);
      ctx.stroke();
      ctx.fill();
    }
    ctx.restore();
  }
}

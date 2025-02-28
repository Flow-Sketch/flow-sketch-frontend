import { FlowCanvasStyle } from '@/types/canvas';

export type BaseSketchElementType = 'text' | 'rect' | 'ellipse';

export abstract class BaseSketchElement {
  constructor(
    public id: string,
    public type: BaseSketchElementType,
    public width: number,
    public height: number,
    public x: number,
    public y: number,
    public elementStyle: FlowCanvasStyle,
    public points?: { x: number; y: number }[],
  ) {}

  // 모든 객체가 공통적으로 가지는 메서드
  abstract draw(ctx: CanvasRenderingContext2D): void;

  // 이동(드래그) 시 위치 변경
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}

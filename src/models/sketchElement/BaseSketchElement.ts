import { FlowCanvasStyle } from '@/types/canvas';

export type BaseSketchElementType = 'text' | 'rect' | 'ellipse';

interface BaseSketchElementParams {
  id: string;
  type: BaseSketchElementType;
  width: number;
  height: number;
  x: number;
  y: number;
  elementStyle: FlowCanvasStyle;
  rotation: number; // 단위 : 라디안(360도 === 2 * PI)
  points?: { x: number; y: number }[];
}

export abstract class BaseSketchElement {
  id: string;
  type: BaseSketchElementType;
  width: number;
  height: number;
  x: number;
  y: number;
  elementStyle: FlowCanvasStyle;
  rotation: number; // 단위 : 라디안(360도 === 2 * PI)
  isEditable: boolean; //
  points?: { x: number; y: number }[];
  constructor(params: BaseSketchElementParams) {
    this.id = params.id;
    this.type = params.type;
    this.width = params.width;
    this.height = params.height;
    this.x = params.x;
    this.y = params.y;
    this.elementStyle = params.elementStyle;
    this.points = params.points;
    this.rotation = params.rotation;
    this.isEditable = false;
  }

  // 모든 객체가 공통적으로 가지는 메서드
  abstract draw(ctx: CanvasRenderingContext2D): void;

  // 이동(드래그) 시 위치 변경
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  // 편집가능 변경 메소드
  enableEditing() {
    this.isEditable = true;
  }

  // 편집불가 변경 메소드
  disableEditing() {
    this.isEditable = false;
  }
}

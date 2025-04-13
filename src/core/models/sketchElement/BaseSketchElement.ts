import { SketchElementStyle } from './SketchElementStyle.ts';
import { EllipseType } from '@/core/models/sketchElement/EllipseSketchElement.ts';
import { RectType } from '@/core/models/sketchElement/RectSketchElement.ts';

export type BaseSketchElementType = RectType | EllipseType;

interface DefaultElementStyle extends SketchElementStyle {
  borderWidth: number;
  borderColor: string;
  background: string;
}

export interface BaseSketchElementParams {
  id: string;
  type: BaseSketchElementType;
  width: number;
  height: number;
  x: number;
  y: number;
  elementStyle?: SketchElementStyle;
  rotation?: number; // 단위 : 라디안(360도 === 2 * PI)
  points?: { x: number; y: number }[];
}

export abstract class BaseSketchElement {
  id: string;
  type: BaseSketchElementType;
  width: number;
  height: number;
  x: number;
  y: number;
  elementStyle: DefaultElementStyle;
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
    this.elementStyle = {
      borderWidth: params.elementStyle?.borderWidth ? params.elementStyle.borderWidth : 2,
      borderColor: params.elementStyle?.borderColor ? params.elementStyle.borderColor : '#000',
      background: params.elementStyle?.background ? params.elementStyle.background : 'transparent',
      ...params.elementStyle,
    };
    this.points = params.points;
    this.rotation = params.rotation ? params.rotation : 0;
    this.isEditable = false;
  }

  // 모든 객체가 공통적으로 가지는 메서드
  abstract draw(ctx: CanvasRenderingContext2D): void;

  // 이동(드래그) 시 위치 변경
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  /**
   * 요소의 크기와 위치를 조정하는 메소드
   *
   * @param dx - X축 방향으로의 마우스 이동량
   * @param dy - Y축 방향으로의 마우스 이동량
   * @param directions - 리사이즈가 시작된 방향들 (top, right, bottom, left)
   */
  resize(dx: number, dy: number, directions: ('top' | 'right' | 'bottom' | 'left')[]) {
    const adjustedDeltaX = directions.includes('left') ? -dx : directions.includes('right') ? dx : 0;
    const adjustedDeltaY = directions.includes('top') ? -dy : directions.includes('bottom') ? dy : 0;
    const deltaX = !directions.includes('left') && !directions.includes('right') ? 0 : dx;
    const deltaY = !directions.includes('top') && !directions.includes('bottom') ? 0 : dy;

    const newWidth = Math.max(this.width + adjustedDeltaX, 10);
    const newHeight = Math.max(this.height + adjustedDeltaY, 10);
    const newX = this.x + deltaX / 2;
    const newY = this.y + deltaY / 2;

    this.x = newX;
    this.y = newY;
    this.width = newWidth;
    this.height = newHeight;
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

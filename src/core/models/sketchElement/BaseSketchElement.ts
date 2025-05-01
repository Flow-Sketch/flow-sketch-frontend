import { SketchElementStyle } from './SketchElementStyle.ts';
import { SketchElementType } from '@/core/models/sketchElement/FactorySketchElement.ts';
import { ElementPoint } from '@/core/models/sketchElement/LineSketchElement.ts';
import { Point } from '@/shared/utils/collidingDetection';
import { nanoid } from 'nanoid';

interface DefaultElementStyle extends SketchElementStyle {
  borderWidth: number;
  borderColor: string;
  background: string;
}

export interface BaseSketchElementParams<T extends SketchElementType> {
  id: string;
  type: T;
  width: number;
  height: number;
  x: number; // 객체의 중심점 X
  y: number; // 객체의 중심점 Y
  elementStyle?: SketchElementStyle;
  rotation?: number; // 단위 : 라디안(360도 === 2 * PI)
  initPoints: Point[] | null;
}

export abstract class BaseSketchElement<T extends SketchElementType> {
  id: string;
  type: T;
  width: number;
  height: number;
  x: number;
  y: number;
  elementStyle: DefaultElementStyle;
  rotation: number; // 단위 : 라디안(360도 === 2 * PI)
  isEditable: boolean; //
  points: Record<string, ElementPoint> | null;
  pointIds: string[] | null;

  constructor(params: BaseSketchElementParams<T>) {
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
    this.rotation = params.rotation ? params.rotation : 0;
    this.isEditable = false;
    this.pointIds = null;
    this.points = null;

    if (params.initPoints) {
      const { convertIds, convertPoint } = this._convertLinePoint(params.initPoints);
      this.points = convertPoint;
      this.pointIds = convertIds;
    }
  }

  // 모든 객체가 공통적으로 가지는 메서드
  abstract draw(ctx: CanvasRenderingContext2D): void;

  _convertLinePoint(points: Point[]) {
    const convertIds: string[] = [];
    const convertPoint: Record<string, ElementPoint> = {};
    points.forEach((point) => {
      const pointId = nanoid();
      convertIds.push(pointId);
      convertPoint[pointId] = { ...point, id: pointId };
    });
    return {
      convertIds,
      convertPoint,
    };
  }

  // 이동(드래그) 시 위치 변경
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    if (this.points && this.pointIds) {
      const updatePoint = this.pointIds.reduce(
        (acc, id) => {
          if (this.points && this.points[id]) {
            const updatePoint = { ...this.points[id], x: this.points[id].x + dx, y: this.points[id].y + dy };
            return { ...acc, [id]: updatePoint };
          }
          return acc;
        },
        {} as Record<string, ElementPoint>,
      );
      this.points = updatePoint;
    }
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

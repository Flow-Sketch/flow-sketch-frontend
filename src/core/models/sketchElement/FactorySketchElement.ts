import { RectSketchElement, RectSketchElementParams, RectType } from '@/core/models/sketchElement/RectSketchElement.ts';
import { LineSketchElement, LineSketchElementParams, LineType } from '@/core/models/sketchElement/LineSketchElement.ts';
import { EllipseSketchElement, EllipseSketchElementParams, EllipseType } from '@/core/models/sketchElement/EllipseSketchElement.ts';

/** ### 목적
 * > 전체 Flow Sketch 에서 지원하는 선 타입
 */
export type SketchLineType = LineType;

/** ### 목적
 * > 전체 Flow Sketch 에서 지원하는 도형 타입
 */
export type SketchShapeType = RectType | EllipseType;

/** ### 목적
 * > 전체 도형에 대한 타입
 */
export type SketchElementType = SketchShapeType | SketchLineType;

export type SketchElementParams<T extends SketchElementType> = T extends EllipseType
  ? EllipseSketchElementParams
  : T extends RectType
    ? RectSketchElementParams
    : T extends LineType
      ? LineSketchElementParams
      : never;

export type SketchElement<T extends SketchElementType = SketchElementType> = T extends EllipseType
  ? EllipseSketchElement
  : T extends RectType
    ? RectSketchElement
    : T extends LineType
      ? LineSketchElement
      : never;

export class FactorySketchElement {
  static createElement<T extends SketchElementType>(param: SketchElementParams<T>) {
    switch (param.type) {
      case 'ellipse':
        return new EllipseSketchElement(param);
      case 'rect':
        return new RectSketchElement(param);
      case 'line':
        return new LineSketchElement(param);
      default:
        throw new Error('잘못된 sketchElement type');
    }
  }

  static convertElement<T extends SketchElementType>(param: SketchElement<T>) {
    switch (param.type) {
      case 'ellipse':
        return Object.assign(new EllipseSketchElement({ ...param, initPoints: null }), param);
      case 'rect':
        return Object.assign(new RectSketchElement({ ...param, initPoints: null }), param);
      case 'line':
        return Object.assign(new LineSketchElement({ ...param, initPoints: [] }), param);
      default:
        throw new Error('잘못된 sketchElement type');
    }
  }
}

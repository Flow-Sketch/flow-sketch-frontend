import { BaseSketchElement, BaseSketchElementType } from '@/core/models/sketchElement/BaseSketchElement.ts';
import { EllipseSketchElement, EllipseSketchElementParams, EllipseType } from '@/core/models/sketchElement/EllipseSketchElement.ts';
import { RectSketchElement, RectSketchElementParams, RectType } from '@/core/models/sketchElement/RectSketchElement.ts';

export type SketchElementParams<T extends BaseSketchElementType> = T extends EllipseType
  ? EllipseSketchElementParams
  : T extends RectType
    ? RectSketchElementParams
    : never;

export class SketchElement {
  static createElement<T extends BaseSketchElementType>(param: SketchElementParams<T>) {
    switch (param.type) {
      case 'ellipse':
        return new EllipseSketchElement(param);
      case 'rect':
        return new RectSketchElement(param);
      default:
        throw new Error('잘못된 sketchElement type');
    }
  }

  static convertElement(json: BaseSketchElement) {
    switch (json.type) {
      case 'ellipse':
        return Object.assign(new EllipseSketchElement({ ...json, type: 'ellipse' }), json);
      case 'rect':
        return Object.assign(new RectSketchElement({ ...json, type: 'rect' }), json);
      default:
        throw new Error('잘못된 sketchElement type');
    }
  }
}

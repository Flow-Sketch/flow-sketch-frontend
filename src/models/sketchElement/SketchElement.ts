import { BaseSketchElementType } from '@/models/sketchElement/BaseSketchElement.ts';
import { EllipseSketchElement, EllipseSketchElementParams } from '@/models/sketchElement/EllipseSketchElement.ts';
import { RectSketchElement, RectSketchElementParams } from '@/models/sketchElement/RectSketchElement.ts';

export type SketchElementParams<T extends BaseSketchElementType> = T extends 'ellipse'
  ? EllipseSketchElementParams
  : T extends 'rect'
    ? RectSketchElementParams
    : never;

export class SketchElement {
  static createElement<T extends BaseSketchElementType>(type: T, param: SketchElementParams<T>) {
    switch (type) {
      case 'ellipse':
        return new EllipseSketchElement(param);
      case 'rect':
        return new RectSketchElement(param);
      default:
        throw new Error('잘못된 sketchElement type');
    }
  }
}

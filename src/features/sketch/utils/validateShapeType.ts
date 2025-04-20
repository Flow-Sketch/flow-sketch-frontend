import { ShapeType } from '@/core/stores';
import { SketchLineType, SketchShapeType } from '@/core/models/sketchElement';

/**
 * ### 목적
 * > 주어진 타입이 유효한 도형 타입인지 검증하는 함수
 *
 * @example
 * if (isShapeType('rect')) {
 *   // 사각형 생성 로직
 * }
 *
 * @remarks
 * 유효하지 않은 타입이 전달될 경우 콘솔에 에러 메시지를 출력
 */
export function isShapeType(shapeType: ShapeType): shapeType is SketchShapeType {
  if (!shapeType) {
    console.error('허용되지 않은 Element 생성시도');
    return false;
  }
  const allowShapeType: SketchShapeType[] = ['rect', 'ellipse'];
  return allowShapeType.includes(shapeType as SketchShapeType);
}

/**
 * ### 목적
 * 주어진 타입이 유효한 선(Line) 타입인지 검증하는 함수
 *
 * @example
 * if (isLineType('line')) {
 *   // 선 생성 로직
 * }
 *
 * @remarks
 * 유효하지 않은 타입이 전달될 경우 콘솔에 에러 메시지를 출력
 */
export function isLineType(shapeType: ShapeType): shapeType is SketchLineType {
  if (!shapeType) {
    console.error('허용되지 않은 Line Element 생성시도');
    return false;
  }
  const allowShapeType: SketchLineType[] = ['line'];
  return allowShapeType.includes(shapeType as SketchLineType);
}

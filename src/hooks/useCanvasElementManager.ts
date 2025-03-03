import { EllipseSketchElement, RectSketchElement } from '@/models/sketchElement';

export interface ElementRegistry {
  elements: {
    [id: string]: EllipseSketchElement | RectSketchElement;
  };
  layerOrder: string[];
}

// 임시로 element 하드코딩
// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export function useCanvasElementManager() {
  const elementRegistry: ElementRegistry = {
    elements: {
      'a-1': new RectSketchElement('a-1', {
        width: 300,
        height: 400,
        x: 1200,
        y: 2400,
      }),
      'a-2': new RectSketchElement('a-2', {
        width: 300,
        height: 400,
        x: 3400,
        y: 10000,
      }),
      'a-3': new EllipseSketchElement('a-3', {
        width: 700,
        height: 700,
        x: 1800,
        y: 1800,
      }),
      'a-4': new EllipseSketchElement('a-4', {
        width: 1700,
        height: 700,
        x: 6999,
        y: 1800,
      }),
    },
    layerOrder: ['a-3', 'a-1', 'a-2', 'a-4'],
  };
  return { elementRegistry };
}

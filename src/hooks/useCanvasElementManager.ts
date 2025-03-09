import { useState } from 'react';
import { EllipseSketchElement, RectSketchElement, SketchElement } from '@/models/sketchElement';
import { SketchElementParams } from '@/models/sketchElement/SketchElement.ts';
import { BaseSketchElementType } from '@/models/sketchElement/BaseSketchElement.ts';

interface TransformParams {
  moveX: number;
  moveY: number;
}

export interface ElementRegistry {
  elements: {
    [id: string]: EllipseSketchElement | RectSketchElement;
  };
  layerOrder: string[];
}

export interface ElementRegistryAction {
  createElement: <T extends BaseSketchElementType>(type: T, params: SketchElementParams<T>) => void;
  deleteElement: (id: string) => void;
  transformElement: (id: string, transformParam: TransformParams) => void;
}

// 임시로 element 를 useState 로 상태지정
// 추후에 전역상태로 변경할 예정
// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export function useCanvasElementManager(): {
  elementRegistry: ElementRegistry;
  elementRegistryAction: ElementRegistryAction;
} {
  const [elementRegistry, setElementRegistry] = useState<ElementRegistry>({
    elements: {
      'a-1': new RectSketchElement({
        id: 'a-1',
        width: 300,
        height: 400,
        x: 1200,
        y: 2400,
        rotation: Math.PI / 4,
      }),
      'a-2': new RectSketchElement({
        id: 'a-2',
        width: 300,
        height: 400,
        x: 3400,
        y: 10000,
      }),
      'a-3': new EllipseSketchElement({
        id: 'a-3',
        width: 1000,
        height: 600,
        x: 1800,
        y: 1800,
        rotation: Math.PI / 5,
      }),
      'a-4': new EllipseSketchElement({
        id: 'a-4',
        width: 1700,
        height: 700,
        x: 6999,
        y: 1800,
      }),
      'a-5': new RectSketchElement({
        id: 'a-5',
        x: 1740,
        y: 1313.3333333,
        width: 2080,
        height: 1933.33333,
        background: 'rgba(100, 100, 100, 0.2)',
      }),
    },
    layerOrder: ['a-3', 'a-1', 'a-2', 'a-4', 'a-5'],
  });

  function createElement<T extends BaseSketchElementType>(type: T, params: SketchElementParams<T>) {
    setElementRegistry((prev) => ({
      elements: { ...prev.elements, [params.id]: SketchElement.createElement(type, params) },
      layerOrder: [...prev.layerOrder, params.id],
    }));
  }

  function deleteElement(id: string) {
    if (!elementRegistry.elements[id]) {
      return;
    }
    const updateElement = { ...elementRegistry.elements };
    delete updateElement[id];
    setElementRegistry((prev) => ({
      elements: updateElement,
      layerOrder: prev.layerOrder.filter((key) => key !== id),
    }));
  }

  function transformElement(id: string, params: TransformParams) {
    const updateElement = elementRegistry.elements[id];
    const updateElements = { ...elementRegistry.elements };
    if (updateElement) {
      updateElement.move(params.moveX, params.moveY);
      updateElements[id] = updateElement;
    }
    setElementRegistry((prev) => ({
      elements: updateElements,
      layerOrder: prev.layerOrder,
    }));
  }

  return {
    elementRegistry,
    elementRegistryAction: {
      createElement,
      deleteElement,
      transformElement,
    },
  };
}

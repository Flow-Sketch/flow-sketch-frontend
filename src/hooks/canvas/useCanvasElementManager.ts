import { EllipseSketchElement, RectSketchElement, SketchElement } from '@/models/sketchElement';
import { SketchElementParams } from '@/models/sketchElement/SketchElement.ts';
import { BaseSketchElementType } from '@/models/sketchElement/BaseSketchElement.ts';
import { FlowCanvasStyle } from '@/types/canvas.ts';
import { useElementRegistryStore } from '@/store';

interface ResizeParams {
  resizeX: number;
  resizeY: number;
  pointDirection: ('right' | 'left' | 'top' | 'bottom')[];
}

interface MoveParams {
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
  moveElement: (id: string, transformParam: MoveParams) => void;
  resizeElement: (id: string, transformParam: ResizeParams) => void;
  updateStyleElement: (id: string, transformParam: FlowCanvasStyle) => void;
}

// 임시로 element 를 useState 로 상태지정
// 추후에 전역상태로 변경할 예정
// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export function useCanvasElementManager(): {
  elementRegistry: ElementRegistry;
  elementRegistryAction: ElementRegistryAction;
} {
  const elementRegistry = useElementRegistryStore((store) => store.elementRegistry);
  const setElementRegistry = useElementRegistryStore.setState;

  function createElement<T extends BaseSketchElementType>(type: T, params: SketchElementParams<T>) {
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: { ...prev.elementRegistry.elements, [params.id]: SketchElement.createElement(type, params) },
        layerOrder: [...prev.elementRegistry.layerOrder, params.id],
      },
    }));
  }

  function deleteElement(id: string) {
    if (!elementRegistry.elements[id]) {
      return;
    }
    const updateElement = { ...elementRegistry.elements };
    delete updateElement[id];
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: updateElement,
        layerOrder: prev.elementRegistry.layerOrder.filter((key) => key !== id),
      },
    }));
  }

  function moveElement(id: string, params: MoveParams) {
    const updateElement = elementRegistry.elements[id];
    const updateElements = { ...elementRegistry.elements };
    if (updateElement) {
      updateElement.move(params.moveX, params.moveY);
      updateElements[id] = updateElement;
    }
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: updateElements,
        layerOrder: prev.elementRegistry.layerOrder,
      },
    }));
  }

  function resizeElement(id: string, params: ResizeParams) {
    const updateElement = elementRegistry.elements[id];
    const updateElements = { ...elementRegistry.elements };
    if (updateElement) {
      updateElement.resize(params.resizeX, params.resizeY, params.pointDirection);
      updateElements[id] = updateElement;
    }
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: updateElements,
        layerOrder: prev.elementRegistry.layerOrder,
      },
    }));
  }

  function updateStyleElement(id: string, param: FlowCanvasStyle) {
    const updateElement = elementRegistry.elements[id];
    const updateElements = { ...elementRegistry.elements };
    if (updateElement) {
      updateElement.elementStyle = { ...updateElement.elementStyle, ...param };
      updateElements[id] = updateElement;
    }
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: updateElements,
        layerOrder: prev.elementRegistry.layerOrder,
      },
    }));
  }

  return {
    elementRegistry,
    elementRegistryAction: {
      createElement,
      deleteElement,
      moveElement,
      resizeElement,
      updateStyleElement,
    },
  };
}

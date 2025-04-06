import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CANVAS_STORAGE } from '@/features/sketchFile/constants';
import { useElementRegistryStore } from '@/stores';
import { getBoundingBox } from '@/utils/boundingBox';
import { useSketchFilesRegistry } from '@/features/sketchFile/hooks';
import { CanvasRegistryState, createCanvasRegistry, ElementRegistry } from '@/models/canvasRegistry';
import { SketchElement, SketchElementParams, SketchElementStyle, BaseSketchElementType } from '@/models/sketchElement';
import { useThrottle } from '@/hooks';

interface ResizeParams {
  resizeX: number;
  resizeY: number;
  pointDirection: ('right' | 'left' | 'top' | 'bottom')[];
}

interface MoveParams {
  moveX: number;
  moveY: number;
}

export interface ElementRegistryAction {
  createElement: <T extends BaseSketchElementType>(type: T, params: SketchElementParams<T>) => void;
  deleteElement: (id: string) => void;
  moveElement: (id: string, transformParam: MoveParams) => void;
  resizeElement: (id: string, transformParam: ResizeParams) => void;
  updateStyleElement: (id: string, transformParam: SketchElementStyle) => void;
}

// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export function useElementRegistry(): {
  elementRegistry: ElementRegistry;
  elementRegistryAction: ElementRegistryAction;
} {
  const userId = 'testUser';
  const { id: canvasId } = useParams();
  const { boardRegistry, boardAction } = useSketchFilesRegistry();
  const throttleEditElementBoard = useThrottle(boardAction.editElementBoard, 300);
  const elementRegistry = useElementRegistryStore((store) => store.elementRegistry);
  const selectElementRegistry = useElementRegistryStore((store) => store.selectElement[userId].elements);
  const setElementRegistry = useElementRegistryStore.setState;

  // 페이지의 pathParams 로 전달된 id 를 기준으로 스토리지 값을 호출 및 store 에 할당
  useEffect(() => {
    // 여기에 id 가 유효한지를 확인해야 함
    if (!canvasId) {
      return;
    }

    const existingCanvas = boardRegistry.canvasList.find((item) => item.id === canvasId);
    if (!existingCanvas) {
      return;
    }

    const canvasListStr = localStorage.getItem(CANVAS_STORAGE);
    if (!canvasListStr) {
      return;
    }

    const canvasStorage: Record<string, CanvasRegistryState> = JSON.parse(canvasListStr);
    const selectCanvasRegistry = canvasStorage[canvasId];
    selectCanvasRegistry.elementRegistry['elements'] = selectCanvasRegistry.elementRegistry.layerOrder.reduce(
      (acc, elementId) => {
        acc[elementId] = SketchElement.convertElement(selectCanvasRegistry.elementRegistry['elements'][elementId]);
        return acc;
      },
      {} as ElementRegistry['elements'],
    );

    // 최종 ElementStore 에 업데이트
    setElementRegistry((prev) => ({ ...prev, ...selectCanvasRegistry }));

    return () => {
      setElementRegistry(() =>
        createCanvasRegistry({
          userId,
          canvasId: 'empty',
        }),
      );
    };
  }, [canvasId, boardRegistry.canvasList]);

  useEffect(() => {
    // 여기에 id 가 유효한지를 확인해야 함
    if (!canvasId) {
      return;
    }

    // store가 초기 상태일 때는 저장하지 않음
    if (elementRegistry.elements && Object.keys(elementRegistry.elements).length === 0 && elementRegistry.layerOrder.length === 0) {
      return;
    }

    throttleEditElementBoard(canvasId, elementRegistry);
  }, [canvasId, elementRegistry]);

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
    const updateSelectElement = { ...selectElementRegistry };

    delete updateElement[id];
    delete updateSelectElement[id];

    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: updateElement,
        layerOrder: prev.elementRegistry.layerOrder.filter((key) => key !== id),
      },
      selectElement: {
        ...prev.selectElement,
        [userId]: {
          ...prev.selectElement[userId],
          elements: updateSelectElement,
          boundingBox: getBoundingBox([]),
        },
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

  function updateStyleElement(id: string, param: SketchElementStyle) {
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

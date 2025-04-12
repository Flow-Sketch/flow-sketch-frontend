import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CANVAS_STORAGE } from '@/features/sketchFiles/constants';
import { useSketchElementRegistryStore } from 'src/core/stores';
import { useSketchFilesRegistry } from '@/features/sketchFiles/hooks';
import { CanvasRegistryState, ElementRegistry, resetSketchFile } from '@/core/models/sketchFile';
import { SketchElement, SketchElementParams, SketchElementStyle, BaseSketchElementType } from '@/core/models/sketchElement';
import { useThrottle } from 'src/shared/hooks';

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
  createElements: <T extends BaseSketchElementType>(params: SketchElementParams<T>[]) => void;
  createSingleElement: <T extends BaseSketchElementType>(params: SketchElementParams<T>) => void;
  deleteElements: (ids: string[]) => void;
  moveElement: (id: string, transformParam: MoveParams) => void;
  resizeElement: (id: string, transformParam: ResizeParams) => void;
  updateStyleElement: (id: string, transformParam: SketchElementStyle) => void;
}

// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export function useSketchElementRegistry(): {
  elementRegistry: ElementRegistry;
  elementRegistryAction: ElementRegistryAction;
} {
  const userId = 'testUser';
  const { id: canvasId } = useParams();

  const { boardRegistry, boardAction } = useSketchFilesRegistry();
  const throttleEditElementBoard = useThrottle(boardAction.editElementBoard, 300);
  const isInitializedSketch = useSketchElementRegistryStore((store) => store.isInitialized);
  const elementRegistry = useSketchElementRegistryStore((store) => store.elementRegistry);
  const setElementRegistry = useSketchElementRegistryStore.setState;

  /** A. 페이지의 pathParams 로 전달된 id 를 기준으로 스토리지 값을 호출 및 store 에 할당 **/
  useEffect(() => {
    if (!canvasId) return;

    const existingCanvas = boardRegistry.canvasList.find((item) => item.id === canvasId);
    if (!existingCanvas) return;

    const canvasListStr = localStorage.getItem(CANVAS_STORAGE);
    if (!canvasListStr) return;

    const canvasStorage: Record<string, CanvasRegistryState> = JSON.parse(canvasListStr);
    const selectCanvasRegistry = canvasStorage[canvasId];

    // json -> element 인스턴스로 변환
    selectCanvasRegistry.elementRegistry['elements'] = selectCanvasRegistry.elementRegistry.layerOrder.reduce(
      (acc, elementId) => {
        acc[elementId] = SketchElement.convertElement(selectCanvasRegistry.elementRegistry['elements'][elementId]);
        return acc;
      },
      {} as ElementRegistry['elements'],
    );
    selectCanvasRegistry.isInitialized = true;

    // 최종 ElementStore 에 업데이트
    setElementRegistry((prev) => ({ ...prev, ...selectCanvasRegistry }));

    // 페이지를 나가면, store 를 초기화
    return () => {
      setElementRegistry(() => resetSketchFile({ userId }));
    };
  }, [canvasId, boardRegistry.canvasList]);

  /** B. store 값이 업데이트 될 때마다 localstorage 값을 업데이트  **/
  useEffect(() => {
    if (!canvasId || !isInitializedSketch) {
      return;
    }
    throttleEditElementBoard(canvasId, elementRegistry);
  }, [canvasId, elementRegistry]);

  const createElements = <T extends BaseSketchElementType>(params: SketchElementParams<T>[]) => {
    const newElements = params.reduce((cur, param) => {
      return { ...cur, [param.id]: SketchElement.createElement(param) };
    }, {});
    const newIds = params.map((param) => param.id);
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: { ...prev.elementRegistry.elements, ...newElements },
        layerOrder: [...prev.elementRegistry.layerOrder, ...newIds],
      },
    }));
  };

  const createSingleElement = <T extends BaseSketchElementType>(params: SketchElementParams<T>) => {
    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: { ...prev.elementRegistry.elements, [params.id]: SketchElement.createElement(params) },
        layerOrder: [...prev.elementRegistry.layerOrder, params.id],
      },
    }));
  };

  const deleteElements = (ids: string[]) => {
    if (ids.length === 0) return;

    const updateElement = { ...elementRegistry.elements };
    for (const id of ids) {
      delete updateElement[id];
    }

    setElementRegistry((prev) => ({
      ...prev,
      elementRegistry: {
        elements: updateElement,
        layerOrder: prev.elementRegistry.layerOrder.filter((key) => !ids.includes(key)),
      },
      selectElements: {
        ...prev.selectElements,
        [userId]: {
          ...prev.selectElements[userId],
          selectElementIds: [],
        },
      },
    }));
  };

  const moveElement = (id: string, params: MoveParams) => {
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
  };

  const resizeElement = (id: string, params: ResizeParams) => {
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
  };

  const updateStyleElement = (id: string, param: SketchElementStyle) => {
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
  };

  return {
    elementRegistry,
    elementRegistryAction: {
      createSingleElement,
      createElements,
      deleteElements,
      moveElement,
      resizeElement,
      updateStyleElement,
    },
  };
}

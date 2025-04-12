import * as React from 'react';
import { useEffect, useState } from 'react';
import { isOBBColliding, isPointInOBB, Point } from '@/shared/utils/collidingDetection';
import { BoundingBox, getBoundingBox } from '@/shared/utils/boundingBox';
import { useElementRegistryStore, useCanvasViewStore, ViewState } from 'src/core/stores';
import { convertSelectBoxList } from '@/features/sketch/utils';
import { BaseSketchElement } from '@/core/models/sketchElement';
import { ElementRegistry, SelectElementRegistry } from '@/core/models/sketchFile';

export type SelectManagerState = {
  dragBox: {
    startPoint: { x: number; y: number } | null;
    endPoint: { x: number; y: number } | null;
  };
  boundingBox: BoundingBox;
  selectElements: string[];
};

export type SelectManagerAction = {
  handleStartMultiSelect: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleUpdateMultiSelect: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleFinalizeMultiSelect: () => void;
  handleSingleSelect: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleClearSelection: () => void;
  handleManualSelectIds: (selectKeys: string[]) => void;
};

const INIT_BOUNDINGBOX = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  cx: 0,
  cy: 0,
  width: 0,
  height: 0,
};

/**
 * ### useSelectElementManager()
 * #### 설명
 * - 캔버스 내에서 요소를 드래그하여 선택할 수 있는 기능
 * - 사용자는 마우스를 드래그하여 선택 박스를 생성하고, 선택 영역을 지정할 수 있음
 *
 * @returns {object} - 선택 상태와 선택 조작 메소드를 포함하는 객체
 *   - `selectState`: 선택 상태를 포함하는 객체
 *     - `dragBox`: 드래그 박스의 시작 및 끝 지점을 포함하는 객체
 *       - `startPoint`: { x: number, y: number } | null - 드래그 시작 지점(View 좌표계)
 *       - `endPoint`: { x: number, y: number } | null - 드래그 끝 지점(View 좌표계)
 *   - `selectAction`: 선택 조작 메소드를 포함하는 객체
 *     - `handleMouseDown`: (event: React.MouseEvent<HTMLCanvasElement>) => void
 *       - 드래그 시작 시 호출되는 함수로, 드래그 시작 지점을 설정합니다.
 *     - `handleMouseMove`: (event: React.MouseEvent<HTMLCanvasElement>) => void
 *       - 드래그 중에 호출되는 함수로, 드래그 끝 지점을 업데이트합니다.
 *     - `handleMouseUp`: () => void
 *       - 드래그 종료 시 호출되는 함수로, 드래그 상태를 초기화합니다.
 */
export function useSelectElementManager(): {
  selectState: SelectManagerState;
  selectAction: SelectManagerAction;
} {
  const userId = 'testUser';
  const viewState = useCanvasViewStore();
  const store = useElementRegistryStore();
  const setElementRegistry = useElementRegistryStore.setState;
  const userSelectState = store.selectElements[userId];

  // 선택된 elements 들의 bounding box 를 그리기
  const [boundingBox, setBoundingBox] = useState<BoundingBox>(INIT_BOUNDINGBOX);

  /** offset 을 변경, scale 변경, 요소 변경 시 선택된 사각형의 표시가 View 에 그대로 표시되게 하기 위함 */
  useEffect(() => {
    const selectElementIds = userSelectState.selectElementIds;

    if (selectElementIds.length === 0) {
      setBoundingBox(() => INIT_BOUNDINGBOX);
      return;
    }

    const elementList = selectElementIds.reduce((cur, elementId) => {
      const originalElement = store.elementRegistry.elements[elementId];
      if (originalElement) return [...cur, originalElement];
      return [...cur];
    }, [] as BaseSketchElement[]);

    const selectBoxList = convertSelectBoxList(elementList, viewState);

    setBoundingBox(() =>
      getBoundingBox(
        selectBoxList.map((item) => ({
          cx: item.viewX,
          cy: item.viewY,
          width: item.width,
          height: item.height,
          rotation: item.rotation,
        })),
      ),
    );
  }, [userSelectState.selectElementIds, viewState.offset, viewState.scale, store.elementRegistry.elements]);

  const updateSelectIds = (ids: string[]) => {
    setElementRegistry((state) => ({
      ...state,
      selectElements: {
        ...state.selectElements,
        [userId]: {
          ...state.selectElements[userId],
          selectElementIds: ids,
        },
      },
    }));
  };

  /** 선택 요소 초기화 */
  const handleClearSelection = () => {
    // 스토어 업데이트
    setElementRegistry((state) => ({
      ...state,
      selectElements: {
        ...state.selectElements,
        [userId]: {
          ...state.selectElements[userId],
          selectElementIds: [],
        },
      },
    }));
  };

  const handleManualSelectIds = (selectIds: string[]) => {
    if (selectIds.length === 0) return;
    updateSelectIds(selectIds);
  };

  const handleStartMultiSelect = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // 마우스 좌클릭에만 해당
    if (!event || event.button !== 0) return;

    const newStartPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    // 스토어 업데이트
    setElementRegistry((state) => ({
      ...state,
      selectElements: {
        ...state.selectElements,
        [userId]: {
          ...state.selectElements[userId],
          dragBox: {
            startPoint: newStartPosition,
            endPoint: newStartPosition,
          },
        },
      },
    }));
  };

  const handleUpdateMultiSelect = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const dragStartPoint = userSelectState.dragBox.startPoint;

    if (!event || !dragStartPoint) return;
    const newDragBox = {
      startPoint: {
        x: dragStartPoint.x,
        y: dragStartPoint.y,
      },
      endPoint: {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      },
    };
    const selectIds = getSelectElementIds(newDragBox, viewState, store.elementRegistry);

    // 스토어 업데이트
    setElementRegistry((state) => ({
      ...state,
      selectElements: {
        ...state.selectElements,
        [userId]: {
          ...state.selectElements[userId],
          selectElementIds: selectIds,
          dragBox: newDragBox,
        },
      },
    }));
  };

  const handleFinalizeMultiSelect = () => {
    // 스토어 업데이트
    setElementRegistry((state) => ({
      ...state,
      selectElements: {
        ...state.selectElements,
        [userId]: {
          ...state.selectElements[userId],
          dragBox: {
            startPoint: null,
            endPoint: null,
          },
        },
      },
    }));
  };

  const handleSingleSelect = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    const selectViewPoint = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    const selectId = getSingleElementId(selectViewPoint, viewState, store.elementRegistry);

    setElementRegistry((state) => ({
      ...state,
      selectElements: {
        ...state.selectElements,
        [userId]: {
          ...state.selectElements[userId],
          selectElementIds: selectId ? [selectId] : [],
        },
      },
    }));
  };

  return {
    selectAction: {
      handleStartMultiSelect,
      handleUpdateMultiSelect,
      handleFinalizeMultiSelect,
      handleSingleSelect,
      handleClearSelection,
      handleManualSelectIds,
    },
    selectState: {
      dragBox: userSelectState.dragBox,
      selectElements: userSelectState.selectElementIds,
      boundingBox,
    },
  };
}

/** ### getSelectElementIds()
 * > dragBox 를 활용해 선택된 Element 리스트를 반환
 */
function getSelectElementIds(dragBox: SelectElementRegistry['dragBox'], viewState: ViewState, elementRegistry: ElementRegistry) {
  const { startPoint, endPoint } = dragBox;
  if (!startPoint || !endPoint) return [];

  const { offset, scale } = viewState;
  const dragRectWidth = Math.abs(endPoint.x - startPoint.x) / scale; // View 좌표계 -> 절대 좌표계로 변경
  const dragRectHeight = Math.abs(endPoint.y - startPoint.y) / scale; // View 좌표계 -> 절대 좌표계로 변경
  const convertOffsetX = (Math.abs(offset.x) + Math.min(startPoint.x, endPoint.x)) / scale; // View 좌표계 -> 절대 좌표계로 변경
  const convertOffsetY = (Math.abs(offset.y) + Math.min(startPoint.y, endPoint.y)) / scale; // View 좌표계 -> 절대 좌표계로 변경
  const dragRect = {
    cx: convertOffsetX + dragRectWidth / 2,
    cy: convertOffsetY + dragRectHeight / 2,
    width: dragRectWidth,
    height: dragRectHeight,
    angle: 0,
  };

  const newSelectElementKeys: string[] = [];
  for (const elementId of elementRegistry.layerOrder) {
    const element = elementRegistry.elements[elementId];
    const isObb = isOBBColliding(dragRect, {
      cx: element.x,
      cy: element.y,
      width: element.width,
      height: element.height,
      angle: element.rotation,
    });

    if (isObb) {
      element.enableEditing();
      newSelectElementKeys.push(elementId);
    }
  }

  return newSelectElementKeys;
}

/** ### getSingleElementId()
 * > point 를 활용해 선택된 단일 Element 리스트를 반환
 */
function getSingleElementId(selectViewPoint: Point, viewState: ViewState, elementRegistry: ElementRegistry) {
  const convertAbsolutePoint = {
    x: (selectViewPoint.x - viewState.offset.x) / viewState.scale,
    y: (selectViewPoint.y - viewState.offset.y) / viewState.scale,
  };

  for (const elementId of elementRegistry.layerOrder) {
    const element = elementRegistry.elements[elementId];
    const isObb = isPointInOBB(
      {
        cx: element.x,
        cy: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
      },
      convertAbsolutePoint,
    );

    if (isObb) {
      element.enableEditing();
      return elementId;
    }
  }

  return null;
}

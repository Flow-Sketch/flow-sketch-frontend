import * as React from 'react';
import { useEffect } from 'react';
import { isOBBColliding } from '@/utils/collidingDetection';
import { BaseSelectBox } from '@/models/selectionBox';
import { getBoundingBox } from '@/utils/boundingBox';
import { useElementRegistryStore, useCanvasViewStore } from '@/store';

export type SelectManagerState = {
  dragBox: {
    startPoint: { x: number; y: number } | null;
    endPoint: { x: number; y: number } | null;
  };
  boundingBox: {
    cx: number;
    cy: number;
    width: number;
    height: number;
  };
  selectElement: {
    [id: string]: BaseSelectBox;
  };
};

export type SelectManagerAction = {
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  resetElement: () => void;
};

/**
 * ### useCanvasSelectElementManager()
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
export function useCanvasSelectElementManager(): {
  selectState: SelectManagerState;
  selectAction: SelectManagerAction;
} {
  // Zustand 스토어에서 상태와 업데이트 함수 가져오기
  const store = useElementRegistryStore();
  const setState = useElementRegistryStore.setState;
  const viewState = useCanvasViewStore();

  // 스토어에서 현재 사용자의 선택 상태 가져오기
  const userId = 'testUser'; // 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const userSelectState = store.selectElement[userId];

  // 마우스 드래그 시, 드래그박스 안에 도형이 포함되어있느지를 탐지하는 로직
  useEffect(() => {
    const { startPoint, endPoint } = userSelectState.dragBox;
    if (!startPoint || !endPoint) return;

    const { offset, scale } = viewState;
    const newSelectElement: { [id: string]: BaseSelectBox } = {};
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

    for (const elementId of store.elementRegistry.layerOrder) {
      const element = store.elementRegistry.elements[elementId];
      const isObb = isOBBColliding(dragRect, {
        cx: element.x,
        cy: element.y,
        width: element.width,
        height: element.height,
        angle: element.rotation,
      });

      if (isObb) {
        element.enableEditing();
        newSelectElement[element.id] = new BaseSelectBox({
          id: element.id,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          offsetX: viewState.offset.x,
          offsetY: viewState.offset.y,
          rotation: element.rotation,
          scale: viewState.scale,
        });
      } else {
        element.disableEditing();
      }
    }

    // 스토어 업데이트
    setState((state) => ({
      ...state,
      selectElement: {
        ...state.selectElement,
        [userId]: {
          ...state.selectElement[userId],
          elements: newSelectElement,
          boundingBox: getBoundingBox(
            Object.values(newSelectElement).map((item) => ({
              cx: item.viewX,
              cy: item.viewY,
              width: item.width,
              height: item.height,
              rotation: item.rotation,
            })),
          ),
        },
      },
    }));

    console.log(newSelectElement);
  }, [userSelectState.dragBox.startPoint, userSelectState.dragBox.endPoint]);

  // offset 을 변경하거나 scale 을 변경했을 때, 선택된 사각형의 표시가 View 에 그대로 표시되게 하기 위함
  useEffect(() => {
    const selectElementIdArr = Object.keys(userSelectState.elements);
    if (selectElementIdArr.length) {
      const newSelectElement: { [id: string]: BaseSelectBox } = {};
      for (const elementId of selectElementIdArr) {
        const originalElement = store.elementRegistry.elements[elementId];
        if (originalElement) {
          // 요소가 존재하는지 확인
          newSelectElement[elementId] = new BaseSelectBox({
            id: originalElement.id,
            x: originalElement.x,
            y: originalElement.y,
            width: originalElement.width,
            height: originalElement.height,
            offsetX: viewState.offset.x,
            offsetY: viewState.offset.y,
            rotation: originalElement.rotation,
            scale: viewState.scale,
          });
        }
      }

      // 스토어 업데이트
      setState((state) => ({
        ...state,
        selectElement: {
          ...state.selectElement,
          [userId]: {
            ...state.selectElement[userId],
            elements: newSelectElement,
            boundingBox: getBoundingBox(
              Object.values(newSelectElement).map((item) => ({
                cx: item.viewX,
                cy: item.viewY,
                width: item.width,
                height: item.height,
                rotation: item.rotation,
              })),
            ),
          },
        },
      }));
    }
  }, [viewState.offset, viewState.scale, store.elementRegistry.elements]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

    const newStartPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    // 스토어 업데이트
    setState((state) => ({
      ...state,
      selectElement: {
        ...state.selectElement,
        [userId]: {
          ...state.selectElement[userId],
          dragBox: {
            startPoint: newStartPosition,
            endPoint: newStartPosition, // 사각형이 0,0에서 그려지는 문제 방지
          },
        },
      },
    }));
  };

  const handleMouseUp = () => {
    // 스토어 업데이트
    setState((state) => ({
      ...state,
      selectElement: {
        ...state.selectElement,
        [userId]: {
          ...state.selectElement[userId],
          dragBox: {
            startPoint: null,
            endPoint: null,
          },
        },
      },
    }));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !userSelectState.dragBox.startPoint) return;

    // 스토어 업데이트
    setState((state) => ({
      ...state,
      selectElement: {
        ...state.selectElement,
        [userId]: {
          ...state.selectElement[userId],
          dragBox: {
            ...state.selectElement[userId].dragBox,
            endPoint: {
              x: event.nativeEvent.offsetX,
              y: event.nativeEvent.offsetY,
            },
          },
        },
      },
    }));
  };

  /** 선택 요소 초기화 */
  const resetElement = () => {
    // 스토어 업데이트
    setState((state) => ({
      ...state,
      selectElement: {
        ...state.selectElement,
        [userId]: {
          ...state.selectElement[userId],
          elements: {},
        },
      },
    }));
  };

  return {
    selectAction: {
      handleMouseMove,
      handleMouseDown,
      handleMouseUp,
      resetElement,
    },
    selectState: {
      dragBox: userSelectState.dragBox,
      boundingBox: userSelectState.boundingBox,
      selectElement: userSelectState.elements,
    },
  };
}

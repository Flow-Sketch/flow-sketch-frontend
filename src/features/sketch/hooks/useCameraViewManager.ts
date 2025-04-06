import * as React from 'react';
import { useCanvasViewStore } from '@/stores';

const CANVAS_WIDTH = 20000; // 실제 캔버스의 크기
const CANVAS_HEIGHT = 20000; // 실제 캔버스의 크기
const VIEW_WIDTH = 1000; // 사용자가 보는 화면의 크기
const VIEW_HEIGHT = 800; // 사용자가 보는 화면의 크기

export type ViewManagerState = {
  offset: { x: number; y: number };
  alignmentPoint: { x: number; y: number };
  scale: number;
};

export type ViewManagerAction = {
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleWheel: (event: React.WheelEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
};

/**
 * ### useCameraViewManager()
 * #### 설명
 * - 사용자는 이 훅을 통해 캔버스의 배율, View 위치를 조정할 수 있음
 *
 * @returns {object} - 뷰 상태와 뷰 조작 메소드를 포함하는 객체
 *   - `viewState`: 뷰 상태를 포함하는 객체
 *     - `offset`: { x: number, y: number } - 캔버스의 현재 오프셋(View 좌표계, offset <0)
 *     - `alignmentPoint`: { x: number, y: number } - 뷰의 정렬 포인트(View 좌표계)
 *     - `scale`: number - 캔버스의 현재 배율
 *   - `viewAction` : 뷰 조작 메소드를 포함하는 객체
 *     - `changeViewAlignmentPoint`: (event: React.MouseEvent<HTMLCanvasElement>) => void
 *       - 뷰의 정렬 포인트를 변경합니다.
 *     - `changeViewScale`: (event: React.WheelEvent<HTMLCanvasElement>) => void
 *       - 캔버스의 배율을 변경합니다.
 *     - `resetAlignment`: () => void
 *       - 뷰의 정렬 포인트를 초기화합니다.
 *     - `changeOffset`: (event: React.MouseEvent<HTMLCanvasElement>) => void
 *       - 캔버스의 오프셋을 변경합니다.
 */
export function useCameraViewManager(): {
  viewState: ViewManagerState;
  viewAction: ViewManagerAction;
} {
  /** 시점 변경에 필요한 상태들
   * ### 동작원리
   * - 시점 이동(x축, y축)시, 클릭한 지점(startPoint)을 시작 지점으로 잡음
   * - 마우스를 클릭하고 있는동안, 계속 이동한 거리를 지속적으로 잡는다.
   * ### 특징
   * - 지점은 절대좌표 기준으로 잡는다.
   */
  // Zustand 스토어에서 상태 가져오기
  const viewState = useCanvasViewStore();
  const setState = useCanvasViewStore.setState;

  /**
   * > View 시점 변경 시, 변화량 측정에 필요한 기준점을 지정하는 함수
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

    // 캔버스 내에서 클릭한 마우스커서의 상대위치
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    setState({
      isDrawing: true,
      alignmentPoint: {
        x: currentX,
        y: currentY,
      },
    });
  };

  /** ### `changeViewScale()`
   * > 확대/축소의 비율을 변경하기 위한 함수
   */
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!event) return;

    const minWidthScale = VIEW_WIDTH / CANVAS_WIDTH;
    const minHeightScale = VIEW_HEIGHT / CANVAS_HEIGHT;

    event.preventDefault();
    const MAX_SCALE = 3;
    const MIN_SCALE = Math.max(minWidthScale, minHeightScale);
    const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, viewState.scale * scaleAmount));

    setState({
      scale: newScale,
      offset: {
        x: rangePosition(viewState.offset.x, -(CANVAS_WIDTH * newScale) + VIEW_WIDTH, 0),
        y: rangePosition(viewState.offset.y, -(CANVAS_HEIGHT * newScale) + VIEW_HEIGHT, 0),
      },
    });
  };

  /** > View 시점의 기준점을 초기화하는 함수
   */
  const handleMouseUp = () => {
    setState({
      isDrawing: false,
      alignmentPoint: {
        x: 0,
        y: 0,
      },
    });
  };

  /**
   * > `offset` 의 위치를 변경하며, 이 함수를 실행해 View 의 위치를 변경
   * > - `offset` : 전체 캔버스에서 특정 지점의 View 시점의 위치
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !viewState.isDrawing) return;

    // 클릭한 시점을 기준으로, 한번의 mouseEvent 로 변경된 delta 값을 offset 에 반영한다.
    const deltaX = event.nativeEvent.offsetX - viewState.alignmentPoint.x;
    const deltaY = event.nativeEvent.offsetY - viewState.alignmentPoint.y;

    // 새로운 오프셋 계산
    const newOffsetX = rangePosition(deltaX + viewState.offset.x, -(CANVAS_WIDTH * viewState.scale) + VIEW_WIDTH, 0);
    const newOffsetY = rangePosition(deltaY + viewState.offset.y, -(CANVAS_HEIGHT * viewState.scale) + VIEW_HEIGHT, 0);

    setState({
      alignmentPoint: {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      },
      offset: {
        x: newOffsetX,
        y: newOffsetY,
      },
    });
  };

  return {
    viewState: {
      offset: viewState.offset,
      alignmentPoint: viewState.alignmentPoint,
      scale: viewState.scale,
    },
    viewAction: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleWheel,
    },
  };
}

function rangePosition(prev: number, min: number, max: number) {
  if (prev < min) return min;
  if (prev > max) return max;
  return prev;
}

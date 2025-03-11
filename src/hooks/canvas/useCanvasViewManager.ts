import * as React from 'react';
import { useState } from 'react';

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
 * ### useCanvasViewManager()
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
export function useCanvasViewManager(): {
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
  const [offset, setOffset] = useState({ x: -200, y: -200 }); // 최종 마우스로 이동시킨 거리
  const [alignmentPoint, setAlignmentPoint] = useState({ x: 0, y: 0 }); // 마우스를 클릭한 순간의 지정
  const [scale, setScale] = useState<number>(0.3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  /**
   * > View 시점 변경 시, 변화량 측정에 필요한 기준점을 지정하는 함수
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

    // 캔버스 내에서 클릭한 마우스커서의 상대위치
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    setIsDrawing(true);
    setAlignmentPoint({
      x: currentX,
      y: currentY,
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
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * scaleAmount));
    setScale(newScale);

    // 보정하기
    setOffset((prev) => ({
      x: rangePosition(prev.x, -(CANVAS_WIDTH * scale) + VIEW_WIDTH, 0),
      y: rangePosition(prev.y, -(CANVAS_HEIGHT * scale) + VIEW_HEIGHT, 0),
    }));
  };

  /** > View 시점의 기준점을 초기화하는 함수
   */
  const handleMouseUp = () => {
    setIsDrawing(false);
    setAlignmentPoint({
      x: 0,
      y: 0,
    });
  };

  /**
   * > `offset` 의 위치를 변경하며, 이 함수를 실행해 View 의 위치를 변경
   * > - `offset` : 전체 캔버스에서 특정 지점의 View 시점의 위치
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isDrawing) return;

    // 클릭한 시점을 기준으로, 한번의 mouseEvent 로 변경된 delta 값을 offset 에 반영한다.
    const deltaX = event.nativeEvent.offsetX - alignmentPoint.x;
    const deltaY = event.nativeEvent.offsetY - alignmentPoint.y;

    // 한번의 mouseEvent 가 끝나면 startPoint 을 초기화한다.
    setAlignmentPoint({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });

    setOffset((prev) => ({
      x: rangePosition(deltaX + prev.x, -(CANVAS_WIDTH * scale) + VIEW_WIDTH, 0),
      y: rangePosition(deltaY + prev.y, -(CANVAS_HEIGHT * scale) + VIEW_HEIGHT, 0),
    }));
  };

  return {
    viewState: {
      offset,
      alignmentPoint,
      scale,
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

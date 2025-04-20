import { create } from 'zustand/react';
import { Point } from '@/shared/utils/collidingDetection';

export interface ViewState {
  /**
   * ### 목적
   * > **(view 좌표계)**
   * > 1. `view 좌표계` 를 기준으로 전체캔버스 내에서 카메라 view 의 위치값(카메라 view 원점(좌측상단)과 캔버스원점(좌측상단) 과의 차이)
   * > 2. `scale` 에 따라서 카메라 view 위치값이 가변적으로 변함
   *
   * ### 값 범위
   * `0 ~ Infinity`
   *
   * ### 베경지식
   * - `view 좌표계` : 절대좌표공간(2차원)에 `scale` 을 곱한 공간
   *
   * @remarks
   * - 만약 절대좌표 offset 을 알고 싶으면 `offset / scale` 로 절대좌표기준으로 offset 을 구함
   */
  offset: Point; // 캔버스 view 의 원점(좌측상단) 기준 절대좌표의 원점(좌측상단) 과의 차이(=== view 좌표계 맞음. 의심하지 말것)
  alignmentPoint: Point; // 캔버스 시점변경 시, 가장 마지막으로 기록된 마우스좌표(== view 좌표계)
  scale: number;
  isDrawing: boolean;
}

// 캔버스 뷰 상태만 관리하는 스토어 (액션 없음)
export const useSketchCameraViewStore = create<ViewState>(() => ({
  offset: { x: -200, y: -200 },
  alignmentPoint: { x: 0, y: 0 },
  scale: 1,
  isDrawing: false,
}));

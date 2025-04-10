import { create } from 'zustand/react';

export interface ViewState {
  offset: { x: number; y: number }; // 캔버스 view 의 원점(좌측상단) 기준 절대좌표의 원점(좌측상단) 과의 차이(== 절대 좌표계)
  alignmentPoint: { x: number; y: number }; // 캔버스 시점변경 시, 가장 마지막으로 기록된 마우스좌표(== view 좌표계)
  scale: number;
  isDrawing: boolean;
}

// 캔버스 뷰 상태만 관리하는 스토어 (액션 없음)
export const useCanvasViewStore = create<ViewState>(() => ({
  offset: { x: -200, y: -200 },
  alignmentPoint: { x: 0, y: 0 },
  scale: 0.3,
  isDrawing: false,
}));

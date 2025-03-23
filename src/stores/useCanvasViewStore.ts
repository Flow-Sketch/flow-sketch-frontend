import { create } from 'zustand/react';

export interface ViewState {
  offset: { x: number; y: number };
  alignmentPoint: { x: number; y: number };
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

import { create } from 'zustand/react';
import { CanvasRegistryState, createCanvasRegistry } from '@/models/canvasRegistry';

const initCanvasRegistry = createCanvasRegistry({
  userId: 'testUser',
  canvasId: 'empty',
});

// 캔버스 요소 레지스트리를 관리하는 전역 상태 스토어
// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export const useElementRegistryStore = create<CanvasRegistryState>(() => ({ ...initCanvasRegistry }));

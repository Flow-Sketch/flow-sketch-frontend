import { create } from 'zustand/react';
import { EllipseSketchElement, RectSketchElement } from '@/models/sketchElement';

export interface ElementRegistry {
  elements: {
    [id: string]: EllipseSketchElement | RectSketchElement;
  };
  layerOrder: string[];
}

interface RegistryState {
  elementRegistry: ElementRegistry;
}

// 캔버스 요소 레지스트리를 관리하는 전역 상태 스토어
// 여러 인원이 접속할 때 캔버스 편집 기능을 이곳에 추가
export const useElementRegistryStore = create<RegistryState>(() => ({
  elementRegistry: {
    elements: {
      'a-1': new RectSketchElement({
        id: 'a-1',
        width: 300,
        height: 400,
        x: 1200,
        y: 2400,
        rotation: Math.PI / 4,
      }),
      'a-2': new RectSketchElement({
        id: 'a-2',
        width: 300,
        height: 400,
        x: 3400,
        y: 10000,
      }),
      'a-3': new EllipseSketchElement({
        id: 'a-3',
        width: 1000,
        height: 600,
        x: 1800,
        y: 1800,
        rotation: Math.PI / 5,
      }),
      'a-4': new EllipseSketchElement({
        id: 'a-4',
        width: 1700,
        height: 700,
        x: 6999,
        y: 1800,
      }),
      'a-5': new RectSketchElement({
        id: 'a-5',
        x: 1740,
        y: 1313.3333333,
        width: 2080,
        height: 1933.33333,
        background: 'rgba(100, 100, 100, 0.2)',
      }),
    },
    layerOrder: ['a-3', 'a-1', 'a-2', 'a-4', 'a-5'],
  },
}));

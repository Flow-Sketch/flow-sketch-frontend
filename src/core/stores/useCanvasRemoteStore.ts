import { create } from 'zustand/react';
import { RectType } from '@/core/models/sketchElement/RectSketchElement.ts';
import { EllipseType } from '@/core/models/sketchElement/EllipseSketchElement.ts';

export type RemoteMode = 'view' | 'edit';
export type ShapeType = null | RectType | EllipseType;

interface RemoteState {
  remoteMode: RemoteMode;
  shapeType: ShapeType;
}

/**
 * ### useCanvasRemoteStore
 *
 * #### 설명
 * > - 캔버스 리모트 컨트롤을 위한 전역 상태 저장소
 * > - 캔버스의 모드(보기/편집)와 선택된 도형 타입을 관리
 * > - 액션 로직은 `useRemoteManager` Hook 에서 처리
 *
 * #### 상태
 * - `remoteMode`: 현재 캔버스 모드 ('view' | 'edit')
 *   - 'view': 캔버스 이동 및 확대/축소 모드
 *   - 'edit': 요소 편집 모드 (선택, 이동, 크기 조절, 생성 등)
 * - `shapeType`: 현재 선택된 도형 타입 (null | 'rect' | 'ellipse')
 *   - null: 도형 생성 모드가 아님 (선택/편집 모드)
 *   - 'rect': 사각형 생성 모드
 *   - 'ellipse': 타원 생성 모드
 *
 * #### 사용 예시
 * ```tsx
 * // 상태만 읽기 (읽기 전용)
 * const { remoteMode, shapeType } = useCanvasRemoteStore();
 *
 * // 상태 변경은 useRemoteManager Hook을 통해 수행
 * const { remoteAction } = useRemoteManager();
 *
 * // JSX에서 사용
 * return (
 *   <div>
 *     <IconButtonGroup value={remoteMode} onChange={handleModeChange}>
 *       <IconButton value={'view'}>보기 모드</IconButton>
 *       <IconButton value={'edit'}>편집 모드</IconButton>
 *     </IconButtonGroup>
 *
 *     {remoteMode === 'edit' && (
 *       <IconButtonGroup value={shapeType} onChange={handleShapeTypeChange}>
 *         <IconButton value={'rect'}>사각형</IconButton>
 *         <IconButton value={'ellipse'}>타원</IconButton>
 *       </IconButtonGroup>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useCanvasRemoteStore = create<RemoteState>(() => ({
  remoteMode: 'view',
  shapeType: null,
}));

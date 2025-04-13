import { RemoteMode, ShapeType, useSketchRemoteStore } from 'src/core/stores';

export type RemoteManagerState = {
  shapeType: ShapeType;
  remoteMode: RemoteMode;
};

export type RemoteManagerAction = {
  handleRemoteModeChange: (mode: RemoteMode[]) => void;
  handleShapeTypeChange: (shapeType: ShapeType[]) => void;
};

/**
 * ### useRemoteManager()
 *
 * #### 설명
 * > - 캔버스 리모트 컨트롤을 위한 상태 및 액션 관리 Hook
 * > - `useSketchRemoteStore`의 상태를 읽고 업데이트하는 로직을 캡슐화
 * > - 컴포넌트에서 직접 스토어를 조작하는 대신 이 Hook 을 통해 상태 변경
 *
 * #### 반환값
 * - `remoteState`: 현재 리모트 상태를 포함하는 객체
 *   - `shapeType`: 현재 선택된 도형 타입 (null | 'rect' | 'ellipse')
 *   - `remoteMode`: 현재 캔버스 모드 ('view' | 'edit')
 * - `remoteAction`: 리모트 상태를 변경하는 액션 메소드를 포함하는 객체
 *   - `handleRemoteModeChange`: (mode: RemoteMode[]) => void
 *     - 캔버스 모드를 변경하는 함수
 *     - IconButtonGroup 컴포넌트의 onChange 이벤트와 호환되도록 배열 형태로 받음
 *   - `handleShapeTypeChange`: (shapeType: ShapeType[]) => void
 *     - 도형 타입을 변경하는 함수
 *     - IconButtonGroup 컴포넌트의 onChange 이벤트와 호환되도록 배열 형태로 받음
 *
 * #### 사용 예시
 * ```tsx
 * const { remoteState, remoteAction } = useRemoteManager();
 *
 * // 모드 변경
 * const handleModeChange = (mode: RemoteMode[]) => {
 *   remoteAction.handleRemoteModeChange(mode);
 * };
 *
 * // 도형 타입 변경
 * const handleShapeTypeChange = (type: ShapeType[]) => {
 *   remoteAction.handleShapeTypeChange(type);
 * };
 *
 * return (
 *   <div>
 *     <IconButtonGroup value={remoteState.remoteMode} onChange={handleModeChange}>
 *       <IconButton value={'view'}>보기 모드</IconButton>
 *       <IconButton value={'edit'}>편집 모드</IconButton>
 *     </IconButtonGroup>
 *   </div>
 * );
 * ```
 */
export function useRemoteManager(): {
  remoteState: RemoteManagerState;
  remoteAction: RemoteManagerAction;
} {
  const { shapeType, remoteMode } = useSketchRemoteStore();
  const setRemoteStore = useSketchRemoteStore.setState;

  const handleRemoteModeChange = (mode: RemoteMode[]) => {
    setRemoteStore({ remoteMode: mode[0] });
  };

  const handleShapeTypeChange = (shapeType: ShapeType[]) => {
    setRemoteStore({ shapeType: shapeType[0] });
  };

  return {
    remoteState: {
      shapeType,
      remoteMode,
    },
    remoteAction: {
      handleRemoteModeChange,
      handleShapeTypeChange,
    },
  };
}

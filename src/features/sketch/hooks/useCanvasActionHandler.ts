import { useState } from 'react';
import { TRANSFORM_CONTROL_CORNER_WIDTH } from '@/features/sketch/constants';
import { Point, isPointInOBB, vectorLength } from '@/shared/utils/collidingDetection';
import { BoundingBox } from '@/shared/utils/boundingBox';
import {
  CreateElementMangerAction,
  DeleteManagerAction,
  MoveManagerAction,
  ResizeManagerAction,
  SelectManagerAction,
  ViewManagerAction,
  ClipboardManagerAction,
  useSelectElementManager,
  useRemoteManager,
} from '@/features/sketch/hooks/index.ts';

/**
 * ### EditMode
 * > Canvas 내의 Element 편집 상태를 나타내는 타입
 *
 * ### property
 * - `idle` - 초기 상태 또는 동작 완료 후의 상태
 * - `resize` - 요소의 크기를 조절하는 상태
 * - `move` - 요소를 이동하는 상태
 * - `moveReady` - 요소 이동 준비 상태 (마우스 다운, mouseMove 이벤트 전)
 * - `select` - 드래그로 여러 요소를 선택하는 상태
 * - `selectReady` - 요소 선택 준비 상태 (마우스 다운, mouseMove 이벤트 전)
 *
 * @remarks
 * - 'Ready' 상태는 마우스 다운 후 실제 동작(이동/선택)이 시작되기 전의 중간 상태
 * - 마우스 이동 거리가 임계값을 넘으면 각각 'move'/'select' 상태로 전환
 * - 임계값을 넘지 않고 마우스 업되면 단일 요소 선택으로 처리
 */
type EditMode = 'idle' | 'resize' | 'move' | 'moveReady' | 'select' | 'selectReady';

export function useCanvasActionHandler(action: {
  viewAction: ViewManagerAction;
  selectAction: SelectManagerAction;
  createAction: CreateElementMangerAction;
  deleteAction: DeleteManagerAction;
  moveAction: MoveManagerAction;
  resizeAction: ResizeManagerAction;
  clipboardAction: ClipboardManagerAction;
}) {
  const { remoteState } = useRemoteManager();
  const { selectState } = useSelectElementManager();
  const [editMode, setEditMode] = useState<EditMode>('idle');
  const [tempStartPoint, setTempStartPoint] = useState<null | Point>(null); // 마우스 down 시 잘못클릭한 것인지 파악하기 위한 용도

  const { viewAction, selectAction, createAction, deleteAction, moveAction, resizeAction, clipboardAction } = action;
  const { shapeType, remoteMode } = remoteState;

  const handleWheel = (() => {
    if (remoteMode === 'view') return viewAction.handleWheel;
  })();

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    if (remoteMode === 'view') return viewAction.handleMouseDown(event);
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseDown(event);
      const point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setTempStartPoint(point); // 초기마우스위치 저장
      const { isInOuterBox, isInInnerBox } = checkBoundingBoxCollision(point, selectState.boundingBox);

      if (isInOuterBox) {
        if (isInInnerBox) {
          setEditMode('moveReady');
          return moveAction.handleMouseDown(event);
        }
        setEditMode('resize');
        return resizeAction.handleMouseDown(event);
      }
      setEditMode('selectReady');
      return selectAction.handleMouseDown(event);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return; // 이미 좌클릭을 한 상태에서만 동작
    if (remoteMode === 'view') return viewAction.handleMouseMove(event);
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseMove(event);
      if (!tempStartPoint) return;
      const deltaVector = {
        x: event.nativeEvent.offsetX - tempStartPoint.x,
        y: event.nativeEvent.offsetY - tempStartPoint.y,
      };
      const distanceToTempPoint = vectorLength(deltaVector);

      // 두 사이의 거리가 10px 을 넘지 않으면 mode 변경을 하지 않음
      if (distanceToTempPoint > 10) {
        if (editMode === 'moveReady') return setEditMode('move');
        if (editMode === 'selectReady') return setEditMode('select');
      }

      if (editMode === 'move') return moveAction.handleMouseMove(event);
      if (editMode === 'resize') return resizeAction.handleMouseMove(event);
      if (editMode === 'select') return selectAction.handleMouseMove(event);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    if (remoteMode === 'view') return viewAction.handleMouseUp();
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseUp();
      if (editMode === 'select') {
        selectAction.handleMouseUp();
      }
      if (editMode === 'resize') {
        resizeAction.handleMouseUp();
      }
      if (editMode === 'move') {
        moveAction.handleMouseUp();
      }
      if (editMode === 'moveReady' || editMode === 'selectReady') {
        selectAction.handleSingleSelect(event);
      }
      setEditMode('idle');
      setTempStartPoint(null);
      return;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!event) return;
    if (remoteMode === 'edit') {
      if (event.key === 'Delete' || event.key === 'Backspace') return deleteAction.handleDeleteElement();
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'c':
            clipboardAction.handleCopyElement();
            break;
          case 'v':
            clipboardAction.handlePasteElement();
            break;
          case 'x':
            clipboardAction.handleCutElement();
            break;
        }
      }
    }
  };

  return {
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleKeyDown,
  };
}

/**
 * ### 용도
 * > 주어진 점이 BoundingBox 의 외부 영역과 내부 영역에 포함되는지 검사
 *
 * ### 설명
 * - `outerBox` : BoundingBox 의 외부경계
 * - `innerBox`: BoundingBox 의 내부경계
 *
 * @example
 * // 변형 컨트롤 영역(테두리)에 있는 경우
 * isInOuterBox === true && isInInnerBox === false
 *
 * // 실제 객체 영역(내부)에 있는 경우
 * isInOuterBox === true && isInInnerBox === true
 */
function checkBoundingBoxCollision(point: Point, boundingBox: BoundingBox) {
  const outerBox = {
    cx: boundingBox.cx,
    cy: boundingBox.cy,
    width: boundingBox.width + TRANSFORM_CONTROL_CORNER_WIDTH,
    height: boundingBox.height + TRANSFORM_CONTROL_CORNER_WIDTH,
    rotation: 0,
  };

  const innerBox = {
    cx: boundingBox.cx,
    cy: boundingBox.cy,
    width: boundingBox.width - TRANSFORM_CONTROL_CORNER_WIDTH,
    height: boundingBox.height - TRANSFORM_CONTROL_CORNER_WIDTH,
    rotation: 0,
  };

  return {
    isInOuterBox: isPointInOBB(outerBox, point),
    isInInnerBox: isPointInOBB(innerBox, point),
  };
}

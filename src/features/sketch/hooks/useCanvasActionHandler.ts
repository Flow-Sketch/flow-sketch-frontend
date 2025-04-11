import { useState } from 'react';
import { TRANSFORM_CONTROL_CORNER_WIDTH } from '@/features/sketch/constants';
import { isPointInOBB, Point, vectorLength } from '@/shared/utils/collidingDetection';
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
      const { boundingBox } = selectState;
      const point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
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

      setTempStartPoint(point);

      if (isPointInOBB(outerBox, point)) {
        if (isPointInOBB(innerBox, point)) {
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

      // 두 사이의 거리가 10px 을 넘지 않으면 값을 업데이트 하지 않음
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

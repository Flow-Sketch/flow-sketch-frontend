import { useState } from 'react';
import { TRANSFORM_CONTROL_CORNER_WIDTH } from '@/features/sketch/constants';
import { isPointInOBB } from '@/shared/utils/collidingDetection';
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
  const [editMode, setEditMode] = useState<'idle' | 'resize' | 'move' | 'moveReady' | 'selectReady' | 'multiSelect'>('idle');

  const { viewAction, selectAction, createAction, deleteAction, moveAction, resizeAction, clipboardAction } = action;
  const { shapeType, remoteMode } = remoteState;

  const handleWheel = (() => {
    if (remoteMode === 'view') return viewAction.handleWheel;
  })();

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
    if (event.buttons !== 1) return; // 마우스 좌클릭하고 있는 동안에만 핸들러 실행
    if (remoteMode === 'view') return viewAction.handleMouseMove(event);
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseMove(event);
      if (editMode === 'move') return moveAction.handleMouseMove(event);
      if (editMode === 'resize') return resizeAction.handleMouseMove(event);
      if (editMode === 'multiSelect') return selectAction.handleMouseMove(event);

      if (editMode === 'moveReady') return setEditMode('move');
      if (editMode === 'selectReady') return setEditMode('multiSelect');
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;
    if (remoteMode === 'view') return viewAction.handleMouseUp();
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseUp();
      if (editMode === 'multiSelect') {
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
      return setEditMode('idle');
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

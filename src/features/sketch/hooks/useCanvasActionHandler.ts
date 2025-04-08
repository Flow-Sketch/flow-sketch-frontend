import { useState } from 'react';
import { TRANSFORM_CONTROL_CORNER_WIDTH } from '../constants/transformControls.ts';
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
  const { shapeType, remoteMode } = remoteState;
  const { selectState } = useSelectElementManager();
  const [editMode, setEditMode] = useState<'select' | 'resize' | 'move'>('select');
  const { viewAction, selectAction, createAction, deleteAction, moveAction, resizeAction, clipboardAction } = action;

  const handleWheel = (() => {
    if (remoteMode === 'view') return viewAction.handleWheel;
  })();

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (remoteMode === 'view') return viewAction.handleMouseDown(event);
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseDown(event);
      const { cx, cy, width, height } = selectState.boundingBox;
      const point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      const outerBox = {
        cx: cx,
        cy: cy,
        width: width + TRANSFORM_CONTROL_CORNER_WIDTH,
        height: height + TRANSFORM_CONTROL_CORNER_WIDTH,
        rotation: 0,
      };
      const innerBox = {
        cx: cx,
        cy: cy,
        width: width - TRANSFORM_CONTROL_CORNER_WIDTH,
        height: height - TRANSFORM_CONTROL_CORNER_WIDTH,
        rotation: 0,
      };
      if (isPointInOBB(outerBox, point)) {
        if (isPointInOBB(innerBox, point)) {
          setEditMode('move');
          return moveAction.handleMouseDown(event);
        }
        setEditMode('resize');
        return resizeAction.handleMouseDown(event);
      }
      return selectAction.handleMouseDown(event);
    }
  };

  const handleMouseUp = () => {
    if (remoteMode === 'view') return viewAction.handleMouseUp();
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseUp();
      if (editMode === 'select') selectAction.handleMouseUp();
      if (editMode === 'resize') {
        resizeAction.handleMouseUp();
        setEditMode('select');
      }
      if (editMode === 'move') {
        moveAction.handleMouseUp();
        setEditMode('select');
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return; // 마우스 우클릭하고 있는 동안에만 핸들러 실행
    if (remoteMode === 'view') return viewAction.handleMouseMove(event);
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseMove(event);
      if (editMode === 'select') selectAction.handleMouseMove(event);
      if (editMode === 'resize') resizeAction.handleMouseMove(event);
      if (editMode === 'move') {
        moveAction.handleMouseMove(event);
      }
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

import { useState } from 'react';
import { TRANSFORM_CONTROL_CORNER_WIDTH } from '@/constants';
import { isPointInOBB } from '@/utils/collidingDetection';
import { useRemoteManager } from '@/hooks/remote';
import {
  CreateElementMangerAction,
  DeleteManagerAction,
  MoveManagerAction,
  ResizeManagerAction,
  SelectManagerAction,
  ViewManagerAction,
  useCanvasSelectElementManager,
} from 'src/hooks/canvasElement';

export function useCanvasActionHandler(action: {
  viewAction: ViewManagerAction;
  selectAction: SelectManagerAction;
  createAction: CreateElementMangerAction;
  deleteAction: DeleteManagerAction;
  moveAction: MoveManagerAction;
  resizeAction: ResizeManagerAction;
}) {
  const { remoteState } = useRemoteManager();
  const { shapeType, remoteMode } = remoteState;
  const { selectState } = useCanvasSelectElementManager();
  const [editMode, setEditMode] = useState<'select' | 'resize' | 'move'>('select');
  const { viewAction, selectAction, createAction, deleteAction, moveAction, resizeAction } = action;

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
    if (remoteMode === 'edit') {
      return deleteAction.handleKeyDown(event);
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

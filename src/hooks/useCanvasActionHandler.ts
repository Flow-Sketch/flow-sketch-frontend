import { useState } from 'react';
import { ViewManagerAction } from '@/hooks/useCanvasViewManager.ts';
import { SelectManagerAction, SelectManagerState } from '@/hooks/useCanvasSelectManager.ts';
import { CreateElementMangerAction } from '@/hooks/useCanvasCreateElementManger.ts';
import { useCanvasRemoteStore } from '@/hooks/useCanvasRemoteStore.ts';
import { DeleteManagerAction } from '@/hooks/useCanvasDeleteElementManager.ts';
import { MoveManagerAction } from '@/hooks/useCanvasMoveElementManager.ts';
import { TRANSFORM_CONTROL_CORNER_WIDTH } from '@/constants';
import { isPointInOBB } from '@/utils/collidingDetection';

export function useCanvasActionHandler(
  selectState: SelectManagerState,
  viewAction: ViewManagerAction,
  selectAction: SelectManagerAction,
  createAction: CreateElementMangerAction,
  deleteAction: DeleteManagerAction,
  moveAction: MoveManagerAction,
) {
  const shapeType = useCanvasRemoteStore((store) => store.shapeType);
  const remoteMode = useCanvasRemoteStore((store) => store.mode);
  const [editMode, setEditMode] = useState<'select' | 'resize' | 'move'>('select');

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
        cx: cx + TRANSFORM_CONTROL_CORNER_WIDTH / 2,
        cy: cy + TRANSFORM_CONTROL_CORNER_WIDTH / 2,
        width,
        height,
        rotation: 0,
      };
      //
      // const innerBox = {
      //   cx: cx - TRANSFORM_CONTROL_CORNER_WIDTH / 2,
      //   cy: cy - TRANSFORM_CONTROL_CORNER_WIDTH / 2,
      //   width,
      //   height,
      //   rotation: 0,
      // };
      if (isPointInOBB(outerBox, point)) {
        // 여기에 resize, move 핸들러를 변경할 수 있는 조건문 추가예정
        setEditMode('move');
        return moveAction.handleMouseDown(event);
      }
      return selectAction.handleMouseDown(event);
    }
  };

  const handleMouseUp = () => {
    if (remoteMode === 'view') return viewAction.handleMouseUp();
    if (remoteMode === 'edit') {
      if (shapeType) return createAction.handleMouseUp();
      if (editMode === 'select') selectAction.handleMouseUp();
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
      if (editMode === 'move') {
        moveAction.handleMouseMove(event);
      }
    }
  };

  const handleKeyDown = () => {
    if (remoteMode === 'edit') {
      return deleteAction.handleKeyDown;
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

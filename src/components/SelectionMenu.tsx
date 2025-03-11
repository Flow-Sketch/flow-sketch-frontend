import { css } from '@emotion/react';
import { useElementRegistryStore } from '@/store';
import { MoveManagerState } from '@/hooks/canvas/useCanvasMoveElementManager.ts';
import { DeleteManagerAction } from '@/hooks/canvas/useCanvasDeleteElementManager.ts';

interface SelectionMenuProps {
  moveState: MoveManagerState;
  deleteAction: DeleteManagerAction;
}

export const SelectionMenu = ({ moveState, deleteAction }: SelectionMenuProps) => {
  const userId = 'testUser';
  const { boundingBox, elements } = useElementRegistryStore((store) => store.selectElement[userId]);
  const positionX = boundingBox.cx;
  const positionY = boundingBox.cy - boundingBox.height / 2 + 20;
  const isActivate = !moveState.isMoving && Object.keys(elements).length > 0;

  return (
    isActivate && (
      <div
        css={css`
          display: flex;
          position: fixed;
          background: white;
          left: ${positionX}px;
          top: ${positionY}px;
        `}
      >
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <p onClick={deleteAction.handleOnClick}>삭제</p>
        </div>
      </div>
    )
  );
};

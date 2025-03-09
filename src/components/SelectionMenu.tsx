import { css } from '@emotion/react';
import { DeleteManagerAction, DeleteManagerState } from '@/hooks/useCanvasDeleteElementManager.ts';

interface SelectionMenuProps {
  deleteState: DeleteManagerState;
  deleteAction: DeleteManagerAction;
}

export const SelectionMenu = ({ deleteState, deleteAction }: SelectionMenuProps) => {
  if (!deleteState.menuPosition?.x || !deleteState.menuPosition?.y) {
    return;
  }

  return (
    <div
      css={css`
        display: flex;
        position: fixed;
        background: white;
        left: ${deleteState.menuPosition.x}px;
        top: ${deleteState.menuPosition.y}px;
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
  );
};

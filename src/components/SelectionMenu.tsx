import { css } from '@emotion/react';
import { useElementRegistryStore } from '@/store';
import { MoveManagerState } from '@/hooks/canvas/useCanvasMoveElementManager.ts';
import { DeleteManagerAction } from '@/hooks/canvas/useCanvasDeleteElementManager.ts';
import { ColorPicker } from '@/components/ColorPicker.tsx';
import { useElementOptionColorManager } from '@/hooks/elementOption';

interface SelectionMenuProps {
  moveState: MoveManagerState;
  deleteAction: DeleteManagerAction;
}

export const SelectionMenu = ({ moveState, deleteAction }: SelectionMenuProps) => {
  const userId = 'testUser';
  const { boundingBox, elements } = useElementRegistryStore((store) => store.selectElement[userId]);
  const isActivate = !moveState.isMoving && Object.keys(elements).length > 0;
  const { colors, changeBackground } = useElementOptionColorManager();

  return (
    isActivate && (
      <div
        css={css`
          display: flex;
          position: fixed;
          background: white;
          left: ${boundingBox.cx}px;
          top: ${boundingBox.cy - boundingBox.height / 2 + 20}px;
        `}
      >
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <p onClick={deleteAction.handleOnClick}>삭제</p>
          <ColorPicker value={colors.backgroundColors} onChange={changeBackground} />
        </div>
      </div>
    )
  );
};

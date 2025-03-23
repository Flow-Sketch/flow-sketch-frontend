import { TbTrash } from 'react-icons/tb';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { colorToken } from '@/styles/color';
import { useElementRegistryStore } from 'src/stores';
import { MoveManagerState } from '@/hooks/canvasElement/useCanvasMoveElementManager.ts';
import { DeleteManagerAction } from '@/hooks/canvasElement/useCanvasDeleteElementManager.ts';
import { useElementOptionColorManager } from '@/hooks/elementOption';
import { IconButton } from '@/components/IconButton.tsx';
import { ColorPicker } from '@/components/ColorPicker.tsx';

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
      <Container left={boundingBox.cx - 40} top={boundingBox.cy - boundingBox.height / 2 - 70}>
        <IconButton onClick={deleteAction.handleOnClick}>
          <TbTrash
            size={22}
            css={css`
              padding: 6px;
            `}
          />
        </IconButton>
        <ColorPicker value={colors.backgroundColors} onChange={changeBackground} />
      </Container>
    )
  );
};

const Container = styled.div<{ left: number; top: number }>`
  display: flex;
  position: fixed;
  padding: 8px;
  border-radius: 12px;
  align-items: center;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  background: ${colorToken['white']};
  border: 1px solid ${colorToken['outlined']};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

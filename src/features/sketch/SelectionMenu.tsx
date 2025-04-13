import styled from '@emotion/styled';
import { TbTrash } from 'react-icons/tb';
import { colorToken } from '@/shared/styles/color';
import { IconButton } from '@/shared/components/IconButton.tsx';
import { ColorPicker } from '@/shared/components/ColorPicker.tsx';
import { useChangeColorElementManager, MoveManagerState, DeleteManagerAction, SelectManagerState } from './hooks';

interface SelectionMenuProps {
  moveState: MoveManagerState;
  selectState: SelectManagerState;
  deleteAction: DeleteManagerAction;
}

export const SelectionMenu = ({ moveState, selectState, deleteAction }: SelectionMenuProps) => {
  const { boundingBox, selectElements } = selectState;
  const isActivateMenu = !moveState.isMoving && Object.keys(selectElements).length > 0;
  const { colors, handleChangeBackgroundColor } = useChangeColorElementManager();

  return (
    isActivateMenu &&
    boundingBox && (
      <Container left={boundingBox.cx - 40} top={boundingBox.cy - boundingBox.height / 2 - 70}>
        <IconButton onClick={deleteAction.handleDeleteElements}>
          <TbTrash size={22} />
        </IconButton>
        <ColorPicker value={colors.backgroundColors} onChange={handleChangeBackgroundColor} />
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

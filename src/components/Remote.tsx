import styled from '@emotion/styled';
import { colorToken } from '@/styles/color';
import { TbPointerFilled, TbHandStop, TbRectangle, TbCircle, TbArrowGuideFilled, TbTriangleSquareCircle, TbTextSize } from 'react-icons/tb';
import { RemoteMode, ShapeType } from 'src/stores';
import { IconButton, IconButtonGroup } from '@/components/IconButton.tsx';
import { SubRemote, SubRemoteGroup } from '@/components/SubRemote.tsx';
import { useRemoteManager } from '@/hooks/remote';

export const Remote = () => {
  const { remoteState, remoteAction } = useRemoteManager();

  const handleElementCreate = (input: ShapeType[]) => {
    remoteAction.handleShapeTypeChange(input);
    remoteAction.handleRemoteModeChange(['edit']);
  };

  const handleModeChange = (input: RemoteMode[]) => {
    remoteAction.handleRemoteModeChange(input);
  };

  return (
    <Container>
      <IconButtonGroup variant={'singleCheck'} value={remoteState.remoteMode} onChange={handleModeChange}>
        <IconButton value={'view'}>
          <TbHandStop size={18} />
        </IconButton>
        <IconButton value={'edit'}>
          <TbPointerFilled size={18} />
        </IconButton>
      </IconButtonGroup>
      <SubRemoteGroup>
        <SubRemote remoteName={'shape'} triggerComponent={<TbTriangleSquareCircle size={24} />}>
          <IconButtonGroup isBorder={false} variant={'singleCheck'} value={remoteState.shapeType} onChange={handleElementCreate}>
            <IconButton value={'rect'}>
              <TbRectangle size={20} />
            </IconButton>
            <IconButton value={'ellipse'}>
              <TbCircle size={20} />
            </IconButton>
          </IconButtonGroup>
        </SubRemote>
        <SubRemote remoteName={'line'} triggerComponent={<TbArrowGuideFilled size={24} />}>
          <span>추후 추가예정</span>
        </SubRemote>
        <SubRemote remoteName={'Text'} triggerComponent={<TbTextSize size={24} />}>
          <span>추후 추가예정</span>
        </SubRemote>
      </SubRemoteGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: fixed;
  left: 40vw;
  bottom: 50px;
  gap: 10px;
  align-items: center;
  background: ${colorToken['white']};
  padding: 6px;
  border-radius: 8px;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  :hover {
    box-shadow:
      0 6px 14px rgba(0, 0, 0, 0.04),
      0 6px 10px rgba(0, 0, 0, 0.1);
  }
`;

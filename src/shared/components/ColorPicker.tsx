import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { AlphaPicker, ColorResult, SwatchesPicker } from 'react-color';

interface ColorPickerProps {
  value: string[];
  onChange: (color: string) => void;
  isActiveAlpha?: boolean;
}

export const ColorPicker = ({ value, onChange, isActiveAlpha = false }: ColorPickerProps) => {
  const colorKey = value.length > 0 ? value : ['#000000'];
  const pickerRef = useRef<HTMLUListElement>(null);
  const pickerButtonRef = useRef<HTMLDivElement>(null);
  const [isOpenPicker, setOpenPicker] = useState<boolean>(false);

  function clickEvent(event: MouseEvent<HTMLElement>) {
    if (pickerButtonRef.current !== null && !pickerButtonRef.current.contains(event.target as any)) {
      setOpenPicker(false);
    }
  }

  function changeColor(color: ColorResult) {
    onChange(color.hex);
  }

  useEffect(() => {
    if (pickerRef.current && pickerButtonRef.current) {
      const pickerRect = pickerButtonRef.current.getBoundingClientRect();
      const pickerX = pickerRect.left;
      const pickerY = pickerRect.top;

      pickerRef.current.style.left = `${pickerX}px`;
      pickerRef.current.style.top = `${pickerY + 30}px`;
    }
    if (isOpenPicker) {
      window.addEventListener('click', clickEvent as any);
    }

    return () => {
      window.removeEventListener('click', clickEvent as any);
    };
  }, [isOpenPicker]);

  return (
    <Container>
      <ButtonContainer ref={pickerButtonRef}>
        <SelectButton onClick={() => setOpenPicker((prev) => !prev)}>
          <MultiColorBadge colors={colorKey} />
        </SelectButton>
      </ButtonContainer>
      {isActiveAlpha && <AlphaPicker color={colorKey[0]} onChange={changeColor} width={'200px'} height={'4px'} />}
      {isOpenPicker &&
        createPortal(
          <PortalBackDropContainer>
            <PickerContainer ref={pickerRef}>
              <SwatchesPicker width={220} onChange={changeColor} />
            </PickerContainer>
          </PortalBackDropContainer>,
          document.body,
        )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  gap: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  align-self: stretch;
  background: white;
`;

const SelectButton = styled.div`
  display: flex;
  height: 26px;
  width: 100%;
  padding: 4px 8px;
  gap: 12px;
  border-radius: 4px;
  align-items: center;
`;

const MultiColorBadge = styled.div<{ colors: string[] }>`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  position: relative;
  background: ${({ colors }) => {
    if (colors.length <= 1) return colors[0] || '#000000';
    return `linear-gradient(to right, ${colors[0]} 0%, ${colors[0]} 50%, ${colors[1]} 50%, ${colors[1]} 100%)`;
  }};
`;

const PortalBackDropContainer = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  z-index: 150; /* fixed, absolute 다른 속성에서 띄우는 경우에도 등장할수 있도록 z-index 추가 */
`;

const PickerContainer = styled.ul`
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  z-index: 150;
  opacity: 1;
`;

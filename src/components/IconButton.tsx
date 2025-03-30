import styled from '@emotion/styled';
import { colorToken } from '@/styles/color';
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';

interface IconButtonProps<Value> {
  _isFocus_?: boolean;
  value?: Value;
  onClick?: () => void;
  children: ReactNode;
}

interface IconButtonGroupProps<Value = unknown> {
  children: ReactElement<IconButtonProps<Value>> | ReactElement<IconButtonProps<Value>>[];
  variant: 'singleCheck' | 'multiCheck';
  onChange?: (input: Value[]) => void;
  defaultValue?: Value[] | Value;
  value?: Value[] | Value;
  isBorder?: boolean;
}

export const IconButton = <T,>({ _isFocus_ = false, ...props }: IconButtonProps<T>) => {
  return (
    <ButtonContainer $isFocus={_isFocus_} onClick={props.onClick}>
      {props.children}
    </ButtonContainer>
  );
};

export const IconButtonGroup = <T,>({ children, variant, onChange, value, isBorder = true }: IconButtonGroupProps<T>) => {
  // 1. children 으로 들어온 IconButton 컴포넌트(JSX) props 내의 value 만 추출
  const buttonValue = React.Children.map(children, (child) => child.props.value);

  // 2. 버튼 컨트롤 전용을 위한 초기상태값 생성(defaultValue 가 있으면 해당되는 버튼을 활성화)
  const buttonControlArray = useMemo(
    () =>
      buttonValue.map((val, index) => {
        const isDefaultValue = Array.isArray(value) ? value.includes(val) : value === val;
        if (isDefaultValue) {
          return { focus: true, id: index, value: val };
        } else {
          return { focus: false, id: index, value: val };
        }
      }),
    [value],
  );

  // 3. 버튼컨트롤 값을 초기상태로 설정
  const [focusButtonStatus, setFocusButtonStatus] = useState<typeof buttonControlArray>(buttonControlArray);

  // 4. `props.value` 가 변경될 때마다 state 계산
  useEffect(() => {
    setFocusButtonStatus(buttonControlArray);
  }, [value]);

  const clickButtonEvent = (clickButtonId: number) => {
    if (variant === 'singleCheck') {
      // 단일 선택 value 계산
      const newUpdateValue = focusButtonStatus.map((button) => {
        const isFocusButton = button.id === clickButtonId;
        return { ...button, focus: isFocusButton };
      });
      const focusValues = newUpdateValue.filter((item) => item.focus);
      const prevValue = focusValues.map((item) => item.value);
      setFocusButtonStatus(newUpdateValue);
      onChange && onChange(prevValue);
      return;
    }
    if (variant === 'multiCheck') {
      // 다중 선택 value 계산
      const newUpdateValue = focusButtonStatus.map((button, index) =>
        index === clickButtonId ? { ...button, focus: !button.focus } : button,
      );
      const focusValues = newUpdateValue.filter((item) => item.focus);
      const prevValue = focusValues.map((item) => item.value);
      setFocusButtonStatus(newUpdateValue);
      onChange && onChange(prevValue);
    }
  };

  return (
    <ButtonGroupContainer $isBorder={isBorder}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          _isFocus_: focusButtonStatus[index].focus,
          onClick: () => clickButtonEvent(index),
        }),
      )}
    </ButtonGroupContainer>
  );
};

const ButtonContainer = styled.div<{ $isFocus: boolean }>`
  display: flex;
  border-radius: 4px;
  padding: 8px;
  ${({ $isFocus }) => ($isFocus ? `background : ${colorToken['surface']}` : '')};

  &:hover {
    background: ${colorToken['surface']};
    border-radius: 4px;
  }
`;

const ButtonGroupContainer = styled.div<{ $isBorder?: boolean }>`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px;
  gap: 4px;
  border-radius: 8px;
  ${({ $isBorder }) => $isBorder && `border: 1px solid ${colorToken['outlined']}`}
`;

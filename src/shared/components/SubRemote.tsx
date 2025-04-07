import styled from '@emotion/styled';
import React, { ReactElement, ReactNode, useMemo, useState } from 'react';
import { colorToken } from '@/shared/styles/color';

interface SubRemoteProps {
  __isFocus__?: boolean;
  __onClick__?: () => void;
  height?: number;
  remoteName: string;
  triggerComponent: ReactElement<any>;
  children: ReactNode;
}

interface SubRemoteGroupProps {
  children: ReactElement<SubRemoteProps> | ReactElement<SubRemoteProps>[];
}

/**
 * ### SubRemote
 *
 * #### 사용용도
 * - 클릭 시 서브메뉴를 표시하는 트리거 버튼과 그 내부 컨텐츠를 관리하는 컴포넌트.
 * - 트리거 버튼을 클릭하면 하위에 서브메뉴가 표시되며, 다시 클릭하거나 다른 트리거를 클릭하면 닫힘
 *
 * #### 사용 예시
 * ```tsx
 * <SubRemote
 *   remoteName="shape"
 *   triggerComponent={<TbTriangleSquareCircle size={24} />}
 * >
 *   {여기에 SubContainer 에 대한 컴포넌트를 주입}
 * </SubRemote>
 * ```
 */
export const SubRemote = ({ remoteName, height, triggerComponent, children, __isFocus__, __onClick__ }: SubRemoteProps) => {
  return (
    <TriggerContainer $isFocus={__isFocus__} key={remoteName} onClick={__onClick__}>
      {triggerComponent &&
        React.cloneElement(triggerComponent, {
          color: __isFocus__ ? 'white' : '',
        })}
      {__isFocus__ && (
        <SubRemoteContainer $height={height} onClick={(e) => e.stopPropagation()}>
          {children}
        </SubRemoteContainer>
      )}
    </TriggerContainer>
  );
};

/**
 * ### SubRemoteGroup
 *
 * #### 사용용도
 * - 여러 SubRemote 컴포넌트를 그룹화하고 상태를 관리하는 컨테이너 컴포넌트
 * - 그룹 내에서 하나의 `SubRemote`만 활성화되도록 관리하며, 다른 `SubRemote`를 클릭하면 이전에 열려있던 `SubRemote`는 자동으로 닫힘
 *
 * #### 사용 예시
 * ```tsx
 * <SubRemoteGroup>
 *  <SubRemote
 *   remoteName="shape"
 *   triggerComponent={<IconShape />}
 *  >
 *    {...}
 *  <SubRemote/>
 *  <SubRemote
 *   remoteName="line"
 *   triggerComponent={<IconLine />}
 *  >
 *    {...}
 *  <SubRemote/>
 * </SubRemoteGroup>
 * ```
 */
export const SubRemoteGroup = ({ children }: SubRemoteGroupProps) => {
  const triggerRemote = React.Children.map(children, (child) => child.props.remoteName);
  const buttonControlArray = useMemo(() => triggerRemote.map((val, index) => ({ focus: false, id: index, remoteName: val })), []);
  const [focusRemoteControls, setFocusRemoteControls] = useState<typeof buttonControlArray>(buttonControlArray);

  const clickRemoteEvent = (clickEventId: number) => {
    const updateRemoteControls = focusRemoteControls.map((controls) => {
      const isClicked = clickEventId === controls.id;
      return { ...controls, focus: isClicked ? !controls.focus : false };
    });
    setFocusRemoteControls(updateRemoteControls);
  };

  return (
    <GroupContainer>
      {React.Children.map(children, (child, id) =>
        React.cloneElement(child, {
          __isFocus__: focusRemoteControls[id].focus,
          __onClick__: () => clickRemoteEvent(id),
        }),
      )}
    </GroupContainer>
  );
};

const GroupContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  border-radius: 4px;
  padding: 2px;
  gap: 8px;
`;

const TriggerContainer = styled.div<{ $isFocus?: boolean }>`
  display: flex;
  padding: 6px;
  border-radius: 8px;
  background: ${({ $isFocus }) => ($isFocus ? colorToken['primaryColor'] : 'none')};
`;

const SubRemoteContainer = styled.div<{ $height?: number }>`
  display: flex;
  position: absolute;
  padding: 8px;
  left: 0;
  bottom: 60px;
  height: ${({ $height }) => ($height ? $height : 'auto')}px;
  border-radius: 12px;
  border: 1px solid ${colorToken['outlined']};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  background: ${colorToken['white']};
`;

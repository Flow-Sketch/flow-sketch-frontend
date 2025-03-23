import { css } from '@emotion/react';
import { CanvasBoard } from '@/components/CanvasBoard.tsx';
import { Remote } from '@/components/Remote.tsx';

export const CanvasPage = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <CanvasBoard />
      <Remote />
    </div>
  );
};

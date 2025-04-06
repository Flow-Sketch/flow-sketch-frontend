import { css } from '@emotion/react';
import { SketchBoard, SketchToolbar } from 'src/features/sketch';

export const CanvasPage = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <SketchBoard />
      <SketchToolbar />
    </div>
  );
};

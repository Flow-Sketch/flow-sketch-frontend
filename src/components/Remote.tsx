import { useCanvasRemoteStore } from '@/hooks';
import { css } from '@emotion/react';

export const Remote = () => {
  const { mode, shapeMode, ...action } = useCanvasRemoteStore();

  return (
    <div
      css={css`
        position: fixed;
        left: 30px;
        top: 30vh;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 12px;
        `}
      >
        {mode === 'view' && <p onClick={() => action.setMode('edit')}>보기</p>}
        {mode === 'edit' && (
          <p
            onClick={() => {
              action.setMode('view');
              action.setShapeMode(null);
            }}
          >
            편집
          </p>
        )}
      </div>
      <div>
        <p
          css={css`
            font-weight: ${shapeMode === 'rect' ? 700 : 500};
          `}
          onClick={() => {
            action.setMode('edit');
            action.setShapeMode('rect');
          }}
        >
          네모네모
        </p>
        <p
          css={css`
            font-weight: ${shapeMode === 'ellipse' ? 700 : 500};
          `}
          onClick={() => {
            action.setMode('edit');
            action.setShapeMode('ellipse');
          }}
        >
          둥글둥글
        </p>
      </div>
    </div>
  );
};

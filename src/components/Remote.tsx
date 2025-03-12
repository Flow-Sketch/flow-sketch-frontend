import { css } from '@emotion/react';
import { TbPointerFilled, TbHandStop, TbRectangle, TbCircle } from 'react-icons/tb';
import { ShapeType, useCanvasRemoteStore } from '@/store';
import { IconButton, IconButtonGroup } from '@/components/IconButton.tsx';

export const Remote = () => {
  const { mode, shapeType, ...action } = useCanvasRemoteStore();

  function clickCreateElement(input: ShapeType[]) {
    action.setShapeType(input);
    action.setMode(['edit']);
  }

  return (
    <div
      css={css`
        display: flex;
        position: fixed;
        left: 40vw;
        bottom: 50px;
        gap: 10px;
      `}
    >
      <IconButtonGroup variant={'singleCheck'} value={mode} onChange={action.setMode}>
        <IconButton value={'view'}>
          <TbHandStop
            size={18}
            css={css`
              padding: 6px;
            `}
          />
        </IconButton>
        <IconButton value={'edit'}>
          <TbPointerFilled
            size={18}
            css={css`
              padding: 6px;
            `}
          />
        </IconButton>
      </IconButtonGroup>
      <IconButtonGroup variant={'singleCheck'} value={shapeType} onChange={clickCreateElement}>
        <IconButton value={'rect'}>
          <TbRectangle
            size={18}
            css={css`
              padding: 6px;
            `}
          />
        </IconButton>
        <IconButton value={'ellipse'}>
          <TbCircle
            size={18}
            css={css`
              padding: 6px;
            `}
          />
        </IconButton>
      </IconButtonGroup>
    </div>
  );
};

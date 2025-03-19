import './App.css';
import { css } from '@emotion/react';
import { CanvasBoard } from '@/components/CanvasBoard.tsx';
import { Remote } from '@/components/Remote.tsx';

function App() {
  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: row;
        `}
      >
        <CanvasBoard />
        <Remote />
      </div>
    </>
  );
}

export default App;

import { css } from '@emotion/react';
import { Canvas } from '@/components/Canvas.tsx';
import './App.css';

function App() {
  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: row;
        `}
      >
        <Canvas />
      </div>
    </>
  );
}

export default App;

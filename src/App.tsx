import { css } from '@emotion/react';
import { Canvas } from '@/components/Canvas.tsx';
import './App.css';
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
        <Remote />
        <Canvas />
      </div>
    </>
  );
}

export default App;

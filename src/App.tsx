import './App.css';
import { css } from '@emotion/react';
import { Canvas } from '@/components/Canvas.tsx';
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
        <Canvas />
        <Remote />
      </div>
    </>
  );
}

export default App;

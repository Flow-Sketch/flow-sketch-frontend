import './App.css';
import { css } from '@emotion/react';
import { router } from '@/routes';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: row;
        `}
      >
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;

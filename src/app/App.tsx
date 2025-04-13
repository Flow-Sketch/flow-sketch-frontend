import { router } from '@/app/route';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import { ROUTE_PATH } from './ROUTE_PATH.ts';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/layouts';
import { PrivateRoute } from './PrivateRoute';
import { NotFoundPage } from '@/pages/error';
import { LoginPage, SignupPage } from '@/pages/auth';
import { CanvasPage } from '@/pages/canvas';
import { Home } from '@/pages/home';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTE_PATH.HOME.ROOT,
        element: <PrivateRoute isAuthenticated={true} />, // 임시로 모두 허용
        children: [
          {
            path: ROUTE_PATH.HOME.MAIN,
            element: <Home />,
          },
        ],
      },
      {
        path: ROUTE_PATH.CANVAS.ROOT,
        element: <PrivateRoute isAuthenticated={true} />, // 임시로 모두 허용
        children: [
          {
            path: ROUTE_PATH.CANVAS.MAIN,
            element: <CanvasPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTE_PATH.AUTH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTE_PATH.AUTH.SIGNUP,
        element: <SignupPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

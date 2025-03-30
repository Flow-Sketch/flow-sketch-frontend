import { ROUTE_PATH } from './ROUTE_PATH.ts';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/layouts';
import { PrivateRoute } from './PrivateRoute';
import { NotFoundPage } from '@/pages/error';
import { LoginPage, SignupPage } from '@/pages/auth';
import { CanvasPage } from '@/pages/canvas';
import { HomePage } from '@/pages/home';

export const router = createBrowserRouter([
  {
    path: ROUTE_PATH.ROOT,
    element: <PrivateRoute isAuthenticated={true} />, // 임시로 모두 허용
    children: [
      {
        path: ROUTE_PATH.USER.ROOT,
        element: <MainLayout />,
        children: [
          {
            path: ROUTE_PATH.USER.HOME,
            element: <HomePage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.CANVAS.ROOT,
        element: <CanvasPage />,
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
    path: ROUTE_PATH.ROOT,
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

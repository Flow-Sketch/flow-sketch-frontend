import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/app/layouts';
import { SketchPage, HomePage, LoginPage, NotFoundPage, SignupPage } from '@/pages';
import { PrivateRoute } from '@/app/route/PrivateRoute.tsx';
import { ROUTE_PATH } from '@/app/route/path.ts';

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
        children: [
          {
            path: ROUTE_PATH.CANVAS.MAIN,
            element: <SketchPage />,
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

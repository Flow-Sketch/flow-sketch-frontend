import { ROUTE_PATH } from '@/routes/ROUTE_PATH.ts';
import { Navigate, Outlet, useMatches } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export const PrivateRoute = ({ isAuthenticated }: PrivateRouteProps) => {
  const matches = useMatches();
  const pathName = matches[1]['pathname'];
  const param = matches[1]['params'];

  // Auth 완료
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATH.AUTH.LOGIN} replace />;
  }

  // userId 가 필요한 도메인에 대해서 path 에 userId 가 없으면 자동으로 userId 를 할당시킴
  if (isUserRequiredPath(pathName) && !param.userId) {
    const getUserId = 'empty';
    return <Navigate to={`${pathName}/${getUserId}`} replace />;
  }

  // 그냥 id 가 없으면 404 페이지로 이동
  if (!param.id) {
    return <Navigate to={'/notfound'} replace />;
  }

  return <Outlet />;
};

const USER_REQUIRED_PATHS = ['/home'];

const isUserRequiredPath = (path: string) => {
  return USER_REQUIRED_PATHS.some((requiredPath) => path.startsWith(requiredPath));
};

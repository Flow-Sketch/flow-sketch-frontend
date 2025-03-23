import { ROUTE_PATH } from '@/routes/ROUTE_PATH.ts';
import { Navigate, Outlet, useMatches } from 'react-router-dom';
import { normalizeUrlPath } from '@/utils/common';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export const PrivateRoute = ({ isAuthenticated }: PrivateRouteProps) => {
  const matches = useMatches();
  const pathName = normalizeUrlPath(matches[1]['pathname'], true);
  const param = matches[1]['params'];

  // Auth 완료
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATH.AUTH.LOGIN} replace />;
  }

  // userId 가 필요한 도메인에 대해서 userId 처리
  if (isUserRequiredPath(pathName)) {
    if (param.userId) return <Outlet />;

    const getUserId = 'empty';
    return <Navigate to={`${pathName}/${getUserId}`} replace />;
  }

  // 도메인별 id 가 없으면 404 페이지로 이동
  if (!param.id) {
    return <Navigate to={'/notfound'} replace />;
  }

  return <Outlet />;
};

const USER_REQUIRED_PATHS = [ROUTE_PATH.HOME.ROOT];

const isUserRequiredPath = (path: string) => {
  return USER_REQUIRED_PATHS.some((requiredPath) => path.startsWith(requiredPath));
};

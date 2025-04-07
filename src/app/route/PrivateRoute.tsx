import { Navigate, Outlet, useMatches } from 'react-router-dom';
import { normalizeUrlPath } from '@/shared/utils/common';
import { ROUTE_PATH } from '@/app/route/path.ts';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export const PrivateRoute = ({ isAuthenticated }: PrivateRouteProps) => {
  const matches = useMatches();

  // Auth 완료
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATH.AUTH.LOGIN} replace />;
  }

  // ROOT 경로면 Home 으로 이동
  if (matches.length === 1) {
    const getUserId = 'local-user';
    return <Navigate to={`${ROUTE_PATH.USER.ROOT}/${getUserId}/home`} replace />;
  }

  const pathName = normalizeUrlPath(matches[1]['pathname'], true);
  const param = matches[1]['params'];

  // userId 가 필요한 도메인에 대해서 userId 처리
  if (isUserRequiredPath(pathName)) {
    if (param.username) return <Outlet />;

    const getUserId = 'local-user';
    return <Navigate to={`${ROUTE_PATH.USER.ROOT}/${getUserId}/home`} replace />;
  }

  // 도메인별 id 가 없으면 404 페이지로 이동
  if (!param.id) {
    return <Navigate to={'/notfound'} replace />;
  }

  return <Outlet />;
};

const USER_REQUIRED_PATHS = [ROUTE_PATH.USER.ROOT];

const isUserRequiredPath = (path: string) => {
  return USER_REQUIRED_PATHS.some((requiredPath) => path.startsWith(requiredPath));
};

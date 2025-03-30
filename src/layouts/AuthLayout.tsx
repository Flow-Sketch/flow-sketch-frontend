import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

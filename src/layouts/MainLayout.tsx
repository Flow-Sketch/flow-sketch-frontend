import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
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

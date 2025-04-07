import { Outlet } from 'react-router-dom';

export const CanvasLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <header />
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>
      <footer className=""></footer>
    </div>
  );
};

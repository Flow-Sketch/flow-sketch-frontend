import { Outlet } from 'react-router-dom';
import FlowSketchLogo from '@/assets/FlowSketch-light.svg';

export const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="flex border-b">
        <div className="flex items-center px-4 p-2">
          <div className="flex items-center gap-2">
            <img src={FlowSketchLogo} className="size-8" alt="Flow Sketch logo" />
            <span className="text-md font-bold">Flow Sketch</span>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>
      <footer className=""></footer>
    </div>
  );
};

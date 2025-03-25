import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button.tsx';
import { CanvasList } from '@/components/CanvasList.tsx';

export const HomePage = () => {
  return (
    <div className="flex flex-col h-full w-full space-y-6 p-10 pb-16">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sketch List</h2>
        <Button size={'sm'}>New Board</Button>
      </div>
      <Separator className="my-6" />
      <CanvasList />
    </div>
  );
};

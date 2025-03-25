import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button.tsx';
import { CanvasItemCard } from '@/components/CanvasItemCard.tsx';

export const HomePage = () => {
  return (
    <div className="h-full w-full space-y-6 p-10 pb-16">
      <div className="flex space-y-0.5 justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sketch List</h2>
        <Button size={'sm'}>New Board</Button>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-32">
        <CanvasItemCard />
        <CanvasItemCard />
        <CanvasItemCard />
        <CanvasItemCard />
        <CanvasItemCard />
        <CanvasItemCard />
        <CanvasItemCard />
        <CanvasItemCard />
      </div>
    </div>
  );
};

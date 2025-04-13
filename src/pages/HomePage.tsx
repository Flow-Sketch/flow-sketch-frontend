import { Separator } from '@/shared/components/ui/separator.tsx';
import { SketchList, SketchCreateButton } from '@/features/sketchFiles';

export const HomePage = () => {
  return (
    <div className="flex flex-col h-full w-full space-y-6 p-10 pb-16">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sketch List</h2>
        <SketchCreateButton />
      </div>
      <Separator className="my-6" />
      <SketchList />
    </div>
  );
};

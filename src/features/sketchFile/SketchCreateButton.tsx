import { useCreateSketchFileManager } from '@/features/sketchFile/hooks';
import { Button } from '@/components/ui/button.tsx';

export const SketchCreateButton = () => {
  const { createCanvas } = useCreateSketchFileManager();
  return (
    <Button size={'sm'} onClick={createCanvas}>
      New Board
    </Button>
  );
};

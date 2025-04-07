import { useCreateSketchFileManager } from '@/features/sketchFiles/hooks';
import { Button } from '@/shared/components/ui/button.tsx';

export const SketchCreateButton = () => {
  const { createCanvas } = useCreateSketchFileManager();
  return (
    <Button size={'sm'} onClick={createCanvas}>
      New Board
    </Button>
  );
};

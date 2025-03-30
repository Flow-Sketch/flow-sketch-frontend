import { useCreateCanvasBoardManager } from '@/hooks/canvasBoard';
import { Button } from '@/components/ui/button.tsx';

export const CreateCanvasButton = () => {
  const { createCanvas } = useCreateCanvasBoardManager();
  return (
    <Button size={'sm'} onClick={createCanvas}>
      New Board
    </Button>
  );
};

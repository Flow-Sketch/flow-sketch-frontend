import { CanvasItemCard } from '@/components/CanvasItemCard.tsx';
import { useCanvasBoardRegistry } from '@/hooks/canvasBoard';

export const CanvasList = () => {
  const { boardRegistry } = useCanvasBoardRegistry();

  if (!boardRegistry.canvasList.length) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center">
        <p>아무것도 없네요! </p>
        <p>새로운 스케치를 만들어볼까요?</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-32">
      {boardRegistry.canvasList.map((metaData) => (
        <CanvasItemCard canvasMeta={metaData} />
      ))}
    </div>
  );
};

import { SketchCard } from '@/features/sketchFiles/SketchCard.tsx';
import { useSketchFilesRegistry } from '@/features/sketchFiles/hooks';

export const SketchList = () => {
  const { boardRegistry } = useSketchFilesRegistry();

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
        <SketchCard key={metaData.id} canvasMeta={metaData} />
      ))}
    </div>
  );
};

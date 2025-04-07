import { useSketchFilesRegistry } from '@/features/sketchFiles/hooks/useSketchFilesRegistry.ts';

export function useDeleteSketchFileManager() {
  const { boardAction } = useSketchFilesRegistry();

  function deleteCanvas(canvasId: string) {
    boardAction.deleteBoard(canvasId);
  }

  return {
    deleteCanvas,
  };
}

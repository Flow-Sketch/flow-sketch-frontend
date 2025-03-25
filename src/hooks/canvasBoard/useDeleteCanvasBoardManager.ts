import { useCanvasBoardRegistry } from '@/hooks/canvasBoard/useCanvasBoardRegistry.ts';

export function useDeleteCanvasBoardManager() {
  const { boardAction } = useCanvasBoardRegistry();

  function deleteCanvas(canvasId: string) {
    boardAction.deleteBoard(canvasId);
  }

  return {
    deleteCanvas,
  };
}

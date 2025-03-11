import { useCanvasElementManager } from '@/hooks/canvas';

export function useElementOptionColorManager() {
  const { elementRegistryAction } = useCanvasElementManager();
}

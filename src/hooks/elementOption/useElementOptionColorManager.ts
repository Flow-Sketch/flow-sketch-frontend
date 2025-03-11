import { useCanvasElementManager } from '@/hooks/canvas';
import { useElementRegistryStore } from '@/store';

export function useElementOptionColorManager() {
  const userId = 'testUser'; // 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const elementRegistryStore = useElementRegistryStore((store) => store.selectElement[userId]);
  const { elementRegistryAction } = useCanvasElementManager();
}

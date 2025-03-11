import { useElementRegistryStore } from '@/store';
import { useCanvasElementManager } from '@/hooks/canvas';

export function useElementOptionColorManager() {
  const userId = 'testUser'; // 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const { elementRegistryAction } = useCanvasElementManager();
  const selectElementStore = useElementRegistryStore((store) => store.selectElement[userId]);

  function changeBackground(colorCode: string) {
    const selectElementKeys = Object.keys(selectElementStore.selectElement);
    for (const elementKey of selectElementKeys) {
      elementRegistryAction.updateStyleElement(elementKey, { background: colorCode });
    }
  }

  return {
    changeBackground,
  };
}

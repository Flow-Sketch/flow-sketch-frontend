import { useElementRegistryStore } from '@/store';
import { useCanvasElementManager } from '@/hooks/canvas';

export function useElementOptionColorManager() {
  const userId = 'testUser'; // 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const { elementRegistry, elementRegistryAction } = useCanvasElementManager();
  const selectElementStore = useElementRegistryStore((store) => store.selectElement[userId]);
  const selectElementKeys = Object.keys(selectElementStore.elements);

  const backgroundColors = selectElementKeys.reduce((acc, val) => {
    const background = elementRegistry.elements[val].elementStyle?.background;
    return background ? [...acc, background] : [...acc];
  }, [] as string[]);

  function changeBackground(colorCode: string) {
    for (const elementKey of selectElementKeys) {
      elementRegistryAction.updateStyleElement(elementKey, { background: colorCode });
    }
  }

  return {
    colors: {
      backgroundColors,
    },
    changeBackground,
  };
}

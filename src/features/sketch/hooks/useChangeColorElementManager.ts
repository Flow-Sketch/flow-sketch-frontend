import { useElementRegistryStore } from 'src/core/stores';
import { useElementRegistry } from '@/features/sketch/hooks/index.ts';

export function useChangeColorElementManager() {
  const userId = 'testUser'; // 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const { elementRegistry, elementRegistryAction } = useElementRegistry();
  const selectElementStore = useElementRegistryStore((store) => store.selectElements[userId].selectElementIds);

  const backgroundColors = selectElementStore.reduce((acc, val) => {
    const background = elementRegistry.elements[val].elementStyle?.background;
    return background ? [...acc, background] : [...acc];
  }, [] as string[]);

  function changeBackground(colorCode: string) {
    for (const elementKey of selectElementStore) {
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

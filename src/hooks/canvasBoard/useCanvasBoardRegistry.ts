import { useEffect, useState } from 'react';
import { CanvasMetadata, CanvasRegistryState, createCanvasRegistry } from '@/models/canvasRegistry';

const CANVAS_STORAGE = 'canvasStorage';

interface CanvasBoardState {
  canvasList: CanvasMetadata[];
  canvasStorage: Record<string, CanvasRegistryState>;
}

interface CanvasBoardAction {
  deleteBoard: (id: string) => void;
  createBoard: (id: string) => void;
}

export function useCanvasBoardRegistry(): {
  boardRegistry: CanvasBoardState;
  boardAction: CanvasBoardAction;
} {
  const userId = 'testUser'; // 임시로 userId 처리
  const [allMetaData, setMetaData] = useState<CanvasMetadata[]>([]);
  const [canvasStorage, setCanvasStorage] = useState<Record<string, CanvasRegistryState>>({});

  // state 와 localStorage 의 싱크를 맞춤
  useEffect(() => {
    const result: CanvasMetadata[] = [];
    const canvasListStr = localStorage.getItem(CANVAS_STORAGE);

    // 아무것도 없으면 초기값 적용 및 return
    if (!canvasListStr) {
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify({}));
      setMetaData([]);
      return;
    }

    const canvasStorage: Record<string, CanvasRegistryState> = JSON.parse(canvasListStr);
    for (const canvasKey of Object.keys(canvasStorage)) {
      const metaData = canvasStorage[canvasKey].metaData;
      result.push(metaData);
    }

    // 시간 내림차순으로 재정렬
    setMetaData(
      result.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      }),
    );

    // 전체 데이터 호출
    setCanvasStorage(() => canvasStorage);
  }, []);

  const deleteBoard = (canvasId: string) => {
    const getCanvasBoard = localStorage.getItem(CANVAS_STORAGE);

    if (getCanvasBoard !== null) {
      const allCanvasList = JSON.parse(getCanvasBoard);
      const updateCanvasList = allCanvasList.filter((item: CanvasRegistryState) => item.metaData.id !== canvasId);
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify(updateCanvasList));
      setMetaData((prev) => prev.filter((meta) => meta.id !== canvasId));
    }
  };

  const createBoard = (canvasId: string) => {
    const getCanvasBoard = localStorage.getItem(CANVAS_STORAGE);

    if (getCanvasBoard !== null) {
      const allCanvasStorage = JSON.parse(getCanvasBoard);
      allCanvasStorage[canvasId] = createCanvasRegistry({ userId, canvasId });
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify(allCanvasStorage));
    }
  };

  return {
    boardRegistry: {
      canvasList: allMetaData,
      canvasStorage: canvasStorage,
    },
    boardAction: {
      deleteBoard,
      createBoard,
    },
  };
}

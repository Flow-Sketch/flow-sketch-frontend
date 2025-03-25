import { useEffect, useState } from 'react';
import { CanvasMetadata, createCanvasRegistry } from '@/models/canvasRegistry';

interface CanvasBoardState {
  canvasList: CanvasMetadata[];
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

  // state 와 localStorage 의 싱크를 맞춤
  useEffect(() => {
    const result: CanvasMetadata[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        const metaData = localStorage.getItem(key);
        if (metaData !== null) {
          result.push(JSON.parse(metaData));
        }
      }
    }

    // 시간 내림차순으로 재정렬
    setMetaData(
      result.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      }),
    );
  }, []);

  const deleteBoard = (canvasId: string) => {
    const getCanvasBoard = localStorage.getItem(canvasId);
    if (getCanvasBoard !== null) {
      localStorage.removeItem(canvasId);
      setMetaData((prev) => prev.filter((meta) => meta.id !== canvasId));
    }
  };

  const createBoard = (canvasId: string) => {
    const newCanvasRegistry = createCanvasRegistry({ userId });
    localStorage.setItem(canvasId, JSON.stringify(newCanvasRegistry));
  };

  return {
    boardRegistry: {
      canvasList: allMetaData,
    },
    boardAction: {
      deleteBoard,
      createBoard,
    },
  };
}

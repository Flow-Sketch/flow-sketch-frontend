import { useEffect } from 'react';
import { CanvasMetadata, CanvasRegistryState, createSketchFile, isValidElementRegistry, isValidMetadata } from '@/core/models/sketchFile';
import { useSketchFileRegistryStore } from 'src/core/stores';
import { CANVAS_STORAGE } from '../constants';

interface CanvasBoardState {
  canvasList: CanvasMetadata[];
}

interface CanvasBoardAction {
  deleteBoard: (id: string) => void;
  createBoard: (id: string) => void;
  editMetaBoard: (id: string, registry: unknown) => void;
  editElementBoard: (id: string, registry: unknown) => void;
}

export function useSketchFilesRegistry(): {
  boardRegistry: CanvasBoardState;
  boardAction: CanvasBoardAction;
} {
  const userId = 'testUser'; // 임시로 userId 처리
  const allMetaData = useSketchFileRegistryStore((store) => store.canvasList);
  const setMetaData = useSketchFileRegistryStore.setState;

  // state 와 localStorage 의 싱크를 맞춤
  useEffect(() => {
    const result: CanvasMetadata[] = [];
    const canvasListStr = localStorage.getItem(CANVAS_STORAGE);

    // 아무것도 없으면 초기값 적용 및 return
    if (!canvasListStr) {
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify({}));
      setMetaData({ canvasList: [] });
      return;
    }

    const canvasStorage: Record<string, CanvasRegistryState> = JSON.parse(canvasListStr);
    for (const canvasKey of Object.keys(canvasStorage)) {
      const metaData = canvasStorage[canvasKey].metaData;
      result.push(metaData);
    }

    // 시간 내림차순으로 재정렬
    setMetaData(() => ({
      canvasList: result.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      }),
    }));
  }, []);

  const deleteBoard = (canvasId: string) => {
    const getCanvasBoard = localStorage.getItem(CANVAS_STORAGE);

    if (getCanvasBoard !== null) {
      const allCanvasBoard = JSON.parse(getCanvasBoard);
      delete allCanvasBoard[canvasId];
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify(allCanvasBoard));
      setMetaData((prev) => ({
        canvasList: prev.canvasList.filter((meta) => meta.id !== canvasId),
      }));
    }
  };

  const createBoard = (canvasId: string) => {
    const getCanvasBoard = localStorage.getItem(CANVAS_STORAGE);

    if (getCanvasBoard !== null) {
      const allCanvasStorage = JSON.parse(getCanvasBoard);
      allCanvasStorage[canvasId] = createSketchFile({ userId, canvasId });
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify(allCanvasStorage));
    }
  };

  const editElementBoard = (canvasId: string, elementRegistry: unknown) => {
    const isValidRegistry = isValidElementRegistry(elementRegistry);
    const getCanvasBoard = localStorage.getItem(CANVAS_STORAGE);

    if (isValidRegistry && getCanvasBoard !== null) {
      const allCanvasStorage: Record<string, CanvasRegistryState> = JSON.parse(getCanvasBoard);
      allCanvasStorage[canvasId]['elementRegistry'] = elementRegistry;
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify(allCanvasStorage));
    }
  };

  const editMetaBoard = (canvasId: string, updateMeta: unknown) => {
    const isValidMeta = isValidMetadata(updateMeta);
    const getCanvasBoard = localStorage.getItem(CANVAS_STORAGE);

    if (isValidMeta && getCanvasBoard !== null) {
      const allCanvasStorage: Record<string, CanvasRegistryState> = JSON.parse(getCanvasBoard);
      allCanvasStorage[canvasId]['metaData'] = updateMeta;
      localStorage.setItem(CANVAS_STORAGE, JSON.stringify(allCanvasStorage));
      setMetaData((prev) => ({
        canvasList: prev.canvasList.reduce((acc, val) => {
          return [...acc, val.id === canvasId ? updateMeta : val];
        }, [] as CanvasMetadata[]),
      }));
    }
  };

  return {
    boardRegistry: {
      canvasList: allMetaData,
    },
    boardAction: {
      deleteBoard,
      createBoard,
      editElementBoard,
      editMetaBoard,
    },
  };
}

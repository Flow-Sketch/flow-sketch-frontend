import { CanvasRegistryState, CanvasMetadata } from './type.ts';

interface CreateRegistryParams {
  userId: string;
  canvasId: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export function createSketchFile({
  userId,
  canvasId,
  name = '새 캔버스',
  description = '',
  isPublic = false,
}: CreateRegistryParams): CanvasRegistryState {
  const now = new Date().toISOString();

  const metaData: CanvasMetadata = {
    id: canvasId,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    lastModifiedBy: userId,
    isPublic,
    version: 1,
  };

  return {
    metaData,
    isInitialized: true,
    elementRegistry: {
      elements: {},
      layerOrder: [],
    },
    selectElements: {
      [userId]: {
        dragBox: { startPoint: null, endPoint: null },
        boundingBox: {
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0,
          cx: 0,
          cy: 0,
          width: 0,
          height: 0,
        },
        elements: {},
      },
    },
  };
}

// sketch 페이지를 나갔을 때, 상태를 초기화하기 위해 사용
export function resetSketchFile({ userId }: { userId: string }): CanvasRegistryState {
  const now = new Date().toISOString();

  const metaData: CanvasMetadata = {
    id: 'empty',
    name: 'empty',
    description: '',
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    lastModifiedBy: userId,
    isPublic: false,
    version: 1,
  };

  return {
    metaData,
    isInitialized: false,
    elementRegistry: {
      elements: {},
      layerOrder: [],
    },
    selectElements: {
      [userId]: {
        dragBox: { startPoint: null, endPoint: null },
        boundingBox: {
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0,
          cx: 0,
          cy: 0,
          width: 0,
          height: 0,
        },
        elements: {},
      },
    },
  };
}

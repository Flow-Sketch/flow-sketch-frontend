import { v4 as uuidv4 } from 'uuid';
import { CanvasRegistryState, CanvasMetadata } from './type';

interface CreateRegistryParams {
  userId: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export function createCanvasRegistry({
  userId,
  name = '새 캔버스',
  description = '',
  isPublic = false,
}: CreateRegistryParams): CanvasRegistryState {
  const now = new Date().toISOString();

  const metaData: CanvasMetadata = {
    id: uuidv4(),
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
    elementRegistry: {
      elements: {},
      layerOrder: [],
    },
    selectElement: {
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

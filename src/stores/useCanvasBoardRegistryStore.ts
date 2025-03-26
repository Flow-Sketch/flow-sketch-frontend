import { create } from 'zustand/react';
import { CanvasMetadata } from '@/models/canvasRegistry';

interface CanvasBoardRegistryStore {
  canvasList: CanvasMetadata[];
}

export const useCanvasBoardRegistryStore = create<CanvasBoardRegistryStore>(() => ({
  canvasList: [],
}));

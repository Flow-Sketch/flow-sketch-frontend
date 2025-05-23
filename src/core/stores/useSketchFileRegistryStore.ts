import { create } from 'zustand/react';
import { CanvasMetadata } from '@/core/models/sketchFile';

interface CanvasBoardRegistryStore {
  canvasList: CanvasMetadata[];
}

export const useSketchFileRegistryStore = create<CanvasBoardRegistryStore>(() => ({
  canvasList: [],
}));

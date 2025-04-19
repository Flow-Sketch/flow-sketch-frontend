import { EllipseSketchElement, RectSketchElement } from '@/core/models/sketchElement';
import { LineSketchElement } from '@/core/models/sketchElement/LineSketchElement.ts';

export interface ElementRegistry {
  elements: {
    [id: string]: EllipseSketchElement | RectSketchElement | LineSketchElement;
  };
  layerOrder: string[];
}

export interface SelectElementRegistry {
  dragBox: {
    startPoint: { x: number; y: number } | null;
    endPoint: { x: number; y: number } | null;
  };
  selectElementIds: string[];
}

export interface CanvasMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  description?: string;
  thumbnail?: string;
  isPublic: boolean;
  collaborators?: string[]; // 협업자 userId 배열
  version: number;
}

export interface CanvasRegistryState {
  isInitialized: boolean;
  metaData: CanvasMetadata;
  elementRegistry: ElementRegistry;
  selectElements: {
    [userId: string]: SelectElementRegistry;
  };
}

import { EllipseSketchElement, RectSketchElement } from '@/core/models/sketchElement';
import { BaseSelectBox } from '@/core/models/selectionBox';

export interface ElementRegistry {
  elements: {
    [id: string]: EllipseSketchElement | RectSketchElement;
  };
  layerOrder: string[];
}

export interface SelectElementRegistry {
  dragBox: {
    startPoint: { x: number; y: number } | null;
    endPoint: { x: number; y: number } | null;
  };
  boundingBox: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    cx: number;
    cy: number;
    width: number;
    height: number;
  };
  elements: {
    [id: string]: BaseSelectBox;
  };
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
  metaData: CanvasMetadata;
  elementRegistry: ElementRegistry;
  selectElement: {
    [userId: string]: SelectElementRegistry;
  };
}

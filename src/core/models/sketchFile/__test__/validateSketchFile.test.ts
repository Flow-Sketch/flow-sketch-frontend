import { expect, describe, it, jest } from '@jest/globals';
import { isValidCanvasRegistryState } from '../validateSketchFile.ts';
import { RectSketchElement } from '@/core/models/sketchElement';
import { CanvasRegistryState } from '@/core/models/sketchFile';

// nanoid 를 import 하지 못해서 우회
jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random().toString(),
  };
});

describe('validateAndParseCanvasRegistry', () => {
  // 유효한 캔버스 레지스트리 데이터 모킹
  const validCanvasRegistry: CanvasRegistryState = {
    isInitialized: false,
    metaData: {
      id: 'test-sketch-1',
      name: 'Test Canvas',
      createdAt: '2024-03-20T09:00:00.000Z',
      updatedAt: '2024-03-20T09:30:00.000Z',
      createdBy: 'testUser',
      lastModifiedBy: 'testUser',
      isPublic: true,
      version: 1,
    },
    elementRegistry: {
      elements: {},
      layerOrder: [],
    },
    selectElements: {
      testUser: {
        dragBox: {
          startPoint: null,
          endPoint: null,
        },
        selectElementIds: [],
      },
    },
  };

  describe('메타데이터 검증', () => {
    it('필수 필드가 누락된 메타데이터는 실패해야 함', () => {
      const invalidMetadata = {
        ...validCanvasRegistry,
        metaData: {
          id: 'test-1', // 다른 필수 필드 누락
        },
      };
      const result = isValidCanvasRegistryState(invalidMetadata);
      expect(result).toBe(false);
    });

    it('잘못된 타입의 필드가 있으면 실패해야 함', () => {
      const invalidMetadata = {
        ...validCanvasRegistry,
        metaData: {
          ...validCanvasRegistry.metaData,
          version: '1', // number 대신 string
        },
      };
      const result = isValidCanvasRegistryState(invalidMetadata);
      expect(result).toBe(false);
    });
  });

  describe('엘리먼트 레지스트리 검증', () => {
    it('유효한 스케치 엘리먼트를 포함하는 경우 성공해야 함', () => {
      const validElements: CanvasRegistryState = {
        ...validCanvasRegistry,
        elementRegistry: {
          elements: {
            'element-1': new RectSketchElement({
              id: 'element-1',
              type: 'rect',
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              initPoints: null,
            }),
          },
          layerOrder: ['element-1'],
        },
      };
      const result = isValidCanvasRegistryState(validElements);
      expect(result).toBe(true);
    });

    it('layerOrder와 elements가 일치하지 않으면 실패해야 함', () => {
      const invalidElements = {
        ...validCanvasRegistry,
        elementRegistry: {
          elements: {},
          layerOrder: ['non-existent-id'],
        },
      };
      const result = isValidCanvasRegistryState(invalidElements);
      expect(result).toBe(false);
    });
  });

  describe('선택 엘리먼트 검증', () => {
    it('유효한 선택 상태를 포함하는 경우 성공해야 함', () => {
      const validSelection: CanvasRegistryState = {
        ...validCanvasRegistry,
        selectElements: {
          testUser: {
            dragBox: {
              startPoint: { x: 0, y: 0 },
              endPoint: { x: 100, y: 100 },
            },
            selectElementIds: ['element-1'],
          },
        },
      };
      const result = isValidCanvasRegistryState(validSelection);
      expect(result).toBe(true);
    });

    it('잘못된 속성 값이 있으면 실패해야 함', () => {
      const invalidBoundingBox = {
        ...validCanvasRegistry,
        selectElements: {
          testUser: {
            ...validCanvasRegistry.selectElements.testUser,
            selectElementIds: null,
          },
        },
      };
      const result = isValidCanvasRegistryState(invalidBoundingBox);
      expect(result).toBe(false);
    });
  });
});

import { CanvasRegistryState, CanvasMetadata, ElementRegistry, SelectElementRegistry } from '@/core/models/sketchFile/type.ts';
import { EllipseSketchElement, RectSketchElement } from '@/core/models/sketchElement';
import { BaseSelectBox } from '@/core/models/selectionBox';

export function isValidMetadata(data: unknown): data is CanvasMetadata {
  if (!data || typeof data !== 'object') return false;

  const metadata = data as CanvasMetadata;
  return (
    typeof metadata.id === 'string' &&
    typeof metadata.name === 'string' &&
    typeof metadata.createdAt === 'string' &&
    typeof metadata.updatedAt === 'string' &&
    typeof metadata.createdBy === 'string' &&
    typeof metadata.lastModifiedBy === 'string' &&
    typeof metadata.isPublic === 'boolean' &&
    typeof metadata.version === 'number' &&
    (!metadata.description || typeof metadata.description === 'string') &&
    (!metadata.thumbnail || typeof metadata.thumbnail === 'string') &&
    (!metadata.collaborators || Array.isArray(metadata.collaborators))
  );
}

export function isValidElementRegistry(data: unknown): data is ElementRegistry {
  if (!data || typeof data !== 'object') return false;

  const registry = data as ElementRegistry;

  if (!registry.elements || typeof registry.elements !== 'object') return false;
  if (!Array.isArray(registry.layerOrder)) return false;

  // elements 객체의 각 값이 유효한 SketchElement인지 확인
  for (const element of Object.values(registry.elements)) {
    if (!(element instanceof EllipseSketchElement || element instanceof RectSketchElement)) {
      return false;
    }
  }

  // layerOrder의 모든 ID가 elements에 존재하는지 확인
  return registry.layerOrder.every((id) => id in registry.elements);
}

export function isValidSelectElementRegistry(data: unknown): data is SelectElementRegistry {
  if (!data || typeof data !== 'object') return false;

  const registry = data as SelectElementRegistry;

  // dragBox 검증
  const isDragBoxValid =
    registry.dragBox &&
    (registry.dragBox.startPoint === null ||
      (typeof registry.dragBox.startPoint?.x === 'number' && typeof registry.dragBox.startPoint?.y === 'number')) &&
    (registry.dragBox.endPoint === null ||
      (typeof registry.dragBox.endPoint?.x === 'number' && typeof registry.dragBox.endPoint?.y === 'number'));

  // boundingBox 검증
  const isBoundingBoxValid =
    registry.boundingBox &&
    typeof registry.boundingBox.minX === 'number' &&
    typeof registry.boundingBox.maxX === 'number' &&
    typeof registry.boundingBox.minY === 'number' &&
    typeof registry.boundingBox.maxY === 'number' &&
    typeof registry.boundingBox.cx === 'number' &&
    typeof registry.boundingBox.cy === 'number' &&
    typeof registry.boundingBox.width === 'number' &&
    typeof registry.boundingBox.height === 'number';

  // elements 검증
  const areElementsValid = registry.elements && Object.values(registry.elements).every((element) => element instanceof BaseSelectBox);

  return isDragBoxValid && isBoundingBoxValid && areElementsValid;
}

/** ## isValidCanvasRegistryState(obj : unknown) : boolean
 * ### 사용목적
 * > 캔버스 레지스트리의 모든 필수 필드와 하위 객체의 구조를 검증
 *
 * ### 검증 내용
 * - metaData: 캔버스의 기본 정보 (id, name, 생성일자 등)
 * - elementRegistry: 캔버스 내 요소들의 정보
 * - selectElement: 사용자별 선택 상태 정보
 *
 * @example
 * ```typescript
 * const validData = {
 *   metaData: {
 *     id: 'test-sketch-1',
 *     name: 'Test Canvas',
 *     createdAt: '2024-03-20T09:00:00.000Z',
 *     updatedAt: '2024-03-20T09:30:00.000Z',
 *     createdBy: 'testUser',
 *     lastModifiedBy: 'testUser',
 *     isPublic: true,
 *     version: 1
 *   },
 *   elementRegistry: {
 *     elements: {},
 *     layerOrder: []
 *   },
 *   selectElement: {
 *     testUser: {
 *       dragBox: { startPoint: null, endPoint: null },
 *       boundingBox: { minX: 0, maxX: 0, minY: 0, maxY: 0, cx: 0, cy: 0, width: 0, height: 0 },
 *       elements: {}
 *     }
 *   }
 * };
 *
 * if (isValidCanvasRegistryState(validData)) {
 *   // validData는 CanvasRegistryState 타입으로 처리됨
 * }
 * ```
 *
 * @param data - 검증할 데이터 객체
 * @returns {boolean} 데이터가 CanvasRegistryState 타입에 부합하면 true, 아니면 false
 */
export function isValidCanvasRegistryState(data: unknown): data is CanvasRegistryState {
  if (!data || typeof data !== 'object') return false;

  const state = data as CanvasRegistryState;

  // 기본 구조 검증
  if (!state.metaData || !state.elementRegistry || !state.selectElement) {
    return false;
  }

  // 각 부분 검증
  const isMetadataValid = isValidMetadata(state.metaData);
  const isElementRegistryValid = isValidElementRegistry(state.elementRegistry);
  const isSelectElementValid = Object.values(state.selectElement).every((registry) => isValidSelectElementRegistry(registry));

  return isMetadataValid && isElementRegistryValid && isSelectElementValid;
}

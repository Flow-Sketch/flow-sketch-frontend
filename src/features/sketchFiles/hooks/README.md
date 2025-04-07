# Canvas Storage Structure

## Overview
> 캔버스 데이터는 localStorage의 'canvasStorage' 키에 저장되며, 모든 캔버스의 메타데이터와 상태를 관리합니다.

## Storage Format

### Key
```typescript
const CANVAS_STORAGE = 'canvasStorage'
```

### Value Structure
```typescript
{
  [canvasId: string]: CanvasRegistryState {
    metaData: {
      id: string;
      name: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      isPublic: boolean;
    },
    elementRegistry: {
      elements: { [elementId: string]: SketchElement },
      layerOrder: string[]
    },
    selectElement: {
      [userId: string]: {
        elements: { [elementId: string]: boolean },
        boundingBox: BoundingBox
      }
    }
  }
}
```

## 예시
```json
{
  "canvas-123": {
    "metaData": {
      "id": "sketch-123",
      "name": "My Canvas",
      "createdAt": "2024-03-20T09:00:00.000Z",
      "updatedAt": "2024-03-20T09:30:00.000Z",
      "createdBy": "testUser",
      "isPublic": true
    },
    "elementRegistry": {
      "elements": {
        "element-1": { /* element data */ },
        "element-2": { /* element data */ }
      },
      "layerOrder": ["element-1", "element-2"]
    },
    "selectElement": {
      "testUser": {
        "elements": {
          "element-1": true
        },
        "boundingBox": { /* bounding box data */ }
      }
    }
  }
}
```

## 주요 작업

1. 캔버스 생성
   - 캔버스를 새로 생성 시 localStorage 의 `canvasStorage` 공간에 새로운 `[canvasKey]`를 할당하고 저장
   - `useSketchFilesRegistry` 의 `createBoard(canvasId)` 메소드로 동작 

2. 캔버스 삭제
   - 캔버스 삭제 시 localStorage 의 `canvasStorage` 공간에 삭제하고자 하는 `[canvasKey]` 를 삭제
   - `useSketchFilesRegistry` 의 `deleteBoard(canvasId)` 메소드로 동작

3. 캔버스 조회
   - 저장된 모든 캔버스의 메타데이터를 시간 역순으로 정렬하여 제공
   - `updatedAt` 기준으로 최신 순으로 정렬됨

## 주의사항
1. 초기 실행 시 'canvasStorage'가 없다면 빈 객체(`{}`)로 초기화
2. 모든 시간 데이터는 ISO 문자열 형식으로 저장
3. 사용자 ID는 현재 'testUser'로 하드코딩 (추후 인증 시스템 연동 예정)

# Sketch File Feature

## 📌 개요

스케치 파일의 저장, 로드, 관리 기능을 제공

## 🛠 주요 기능
### 파일 관리
- 스케치 저장/불러오기
- 파일 목록 관리
- 자동 저장

### 메타데이터 관리
- 파일 정보 관리
- 최근 작업 기록
- 썸네일 생성/관리

## 💾 데이터 구조

### 파일 메타데이터
```typescript
interface SketchFileMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  thumbnail?: string;
  isPublic: boolean;
  version: number;
}
```

## 🔄 상태 관리 흐름

1. 사용자 작업 발생
2. 상태 업데이트 (useCanvasBoardRegistry)
3. 로컬 스토리지 동기화
4. UI 업데이트

## 🎣 Hooks
> `hooks` 폴더 내의 `README.md` 를 확인할 것

## 📝 사용 예시
### 파일 저장

```typescript
const { boardAction } = useCanvasBoardRegistry();

// 새 보드 생성
boardAction.createBoard('new-board');

// 메타데이터 업데이트
boardAction.editMetaBoard('board-id', {
  name: '새 스케치',
  updatedAt: new Date().toISOString(),
});
```

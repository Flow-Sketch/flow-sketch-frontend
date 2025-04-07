/**
 * URL 경로의 슬래시를 정규화하는 유틸리티 함수
 * - 중복 슬래시 제거
 * - 끝의 슬래시 제거 (옵션)
 * - 시작은 항상 슬래시로 시작
 */
export function normalizeUrlPath(path: string, removeTrailingSlash: boolean = true): string {
  // 1. 연속된 슬래시를 하나로 치환
  let normalized = path.replace(/\/+/g, '/');

  // 2. 시작이 슬래시가 아니면 추가
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  // 3. 끝의 슬래시 제거 (옵션)
  if (removeTrailingSlash && normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

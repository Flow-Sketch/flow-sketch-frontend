/**
 * 사각형의 중점을 기준으로 AABB 방식을 사용하여 점이 사각형 내부에 있는지 판별
 *
 * @param rect - 사각형 정보 (cx, cy는 사각형의 중심점 좌표)
 * @param point - 판별할 점의 좌표
 * @returns 점이 사각형 내부에 있으면 true, 아니면 false
 */
export function isPointInAABB(rect: { cx: number; cy: number; width: number; height: number }, point: { x: number; y: number }): boolean {
  // 사각형의 절반 크기 계산
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  // 중심점을 기준으로 경계 검사
  return (
    point.x >= rect.cx - halfWidth && // 왼쪽 경계
    point.x <= rect.cx + halfWidth && // 오른쪽 경계
    point.y >= rect.cy - halfHeight && // 위쪽 경계
    point.y <= rect.cy + halfHeight // 아래쪽 경계
  );
}

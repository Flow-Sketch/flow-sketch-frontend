interface Point {
  x: number;
  y: number;
}

interface ElementBox {
  cx: number;
  cy: number;
  width: number;
  height: number;
  rotation: number;
}

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
}

/**
 * ### getBoundingBox
 *
 * #### 설명
 * - 여러 요소들을 포함하는 최소 경계 상자(Axis-Aligned Bounding Box)를 계산.
 * - 각 요소의 회전을 고려하여 모든 요소를 완전히 포함하는 직사각형 영역을 반환.
 *
 * #### 동작 원리
 * 1. 각 요소의 회전을 고려하여 4개의 꼭지점 좌표를 계산
 * 2. 모든 꼭지점 중 최소/최대 X, Y 좌표를 찾아 경계 상자를 결정
 * 3. 경계 상자의 중심점, 너비, 높이를 계산
 *
 * #### 주의사항
 * - 빈 배열이 입력되면 minX, minY는 Infinity, maxX, maxY는 -Infinity 로 반환됨
 * - 이 경우 cx, cy는 NaN, width, height는 -Infinity가 됩니다.
 *
 * @param selectElements - 경계 상자를 계산할 요소 배열
 * @returns 계산된 경계 상자 정보
 */
export function getBoundingBox(selectElements: ElementBox[]): BoundingBox {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const element of selectElements) {
    // 사각형의 중심점
    const cx = element.cx;
    const cy = element.cy;

    const halfWidth = element.width / 2;
    const halfHeight = element.height / 2;
    const cosA = Math.cos(element.rotation);
    const sinA = Math.sin(element.rotation);

    // 사각형의 4개 꼭지점 좌표 계산
    const corners: Point[] = [
      { x: -halfWidth, y: -halfHeight }, // 왼쪽 상단
      { x: halfWidth, y: -halfHeight }, // 오른쪽 상단
      { x: halfWidth, y: halfHeight }, // 오른쪽 하단
      { x: -halfWidth, y: halfHeight }, // 왼쪽 하단
    ].map(({ x, y }) => ({
      x: cx + (x * cosA - y * sinA),
      y: cy + (x * sinA + y * cosA),
    }));

    // 최소/최대 값 업데이트
    for (const point of corners) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    cx: minX + (maxX - minX) / 2,
    cy: minY + (maxY - minY) / 2,
    width: maxX - minX,
    height: maxY - minY,
  };
}

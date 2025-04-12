export interface Point {
  x: number;
  y: number;
}

export interface RectangleInfo {
  cx: number; // 사각형 중심 X 좌표
  cy: number; // 사각형 중심 Y 좌표
  width: number; // 사각형 너비
  height: number; // 사각형 높이
  angle: number; // 회전각 (라디안)
}

/**
 * 회전된 직사각형의 꼭지점을 계산.
 * 중심을 기준으로 너비, 높이, 회전각에 따라 4개 점의 좌표를 반환함.
 */
export function rectCorners(rect: RectangleInfo): Point[] {
  const { cx, cy, width, height, angle } = rect;
  const halfW = width / 2;
  const halfH = height / 2;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // 중심을 원점으로 했을 때의 상대 좌표 (시계 또는 반시계 순서)
  const localCorners: Point[] = [
    { x: -halfW, y: -halfH }, // 왼쪽 위
    { x: halfW, y: -halfH }, // 오른쪽 위
    { x: halfW, y: halfH }, // 오른쪽 아래
    { x: -halfW, y: halfH }, // 왼쪽 아래
  ];

  // 회전 변환 후, 다시 중심(cx, cy)를 더해 실제 좌표로 변환
  return localCorners.map(({ x, y }) => ({
    x: cx + x * cosA - y * sinA,
    y: cy + x * sinA + y * cosA,
  }));
}

/** 두 벡터의 내적을 반환(스칼라) */
export function dotProduct(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}

/** 두 점의 차 (벡터)를 반환(a - b) */
export function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

/** 벡터의 길이(크기)를 반환 */
export function vectorLength(v: Point): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/** 벡터를 단위벡터로 변환(길이 1, 방향만 가짐) */
export function normalizeVector(v: Point): Point {
  const len = vectorLength(v);
  return { x: v.x / len, y: v.y / len };
}

/** 벡터의 수직(법선) 벡터를 반홤 */
export function perpendicularVector(v: Point): Point {
  return { x: -v.y, y: v.x };
}

/**
 * 점들을 주어진 축(axis)에 투영하여 최소, 최대 값을 계산
 */
export function projectPointsOntoAxis(points: Point[], axis: Point): { min: number; max: number } {
  let min = dotProduct(points[0], axis);
  let max = min;
  for (let i = 1; i < points.length; i++) {
    const proj = dotProduct(points[i], axis);
    if (proj < min) min = proj;
    if (proj > max) max = proj;
  }
  return { min, max };
}

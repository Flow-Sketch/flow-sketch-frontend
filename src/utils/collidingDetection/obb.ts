import {
  normalizeVector,
  perpendicularVector,
  projectPointsOntoAxis,
  rectCorners,
  subtract,
  Point,
  RectangleInfo,
} from '../collidingDetection/common.ts';

/** 두 구간이 겹치는지 확인 */
function isOverlapping(minA: number, maxA: number, minB: number, maxB: number): boolean {
  return maxA >= minB && maxB >= minA;
}

/**
 * Separating Axis Theorem(SAT)을 사용하여 두 OBB(회전된 직사각형)가 충돌하는지 판별
 */
export function isOBBColliding(rect1: RectangleInfo, rect2: RectangleInfo): boolean {
  const corners1 = rectCorners(rect1);
  const corners2 = rectCorners(rect2);

  // 각 OBB에서 두 개의 모서리 벡터에 대한 법선(정규화된)을 구한다.
  const axes: Point[] = [];
  for (const corners of [corners1, corners2]) {
    // 예를 들어, 첫 번째 모서리와 두 번째 모서리의 법선
    for (let i = 0; i < 2; i++) {
      const p1 = corners[i];
      const p2 = corners[(i + 1) % corners.length];
      const edge = subtract(p2, p1);
      const axis = normalizeVector(perpendicularVector(edge));
      axes.push(axis);
    }
  }

  // 각 축에 대해 두 사각형의 투영 구간이 겹치는지 검사한다.
  for (const axis of axes) {
    const proj1 = projectPointsOntoAxis(corners1, axis);
    const proj2 = projectPointsOntoAxis(corners2, axis);
    if (!isOverlapping(proj1.min, proj1.max, proj2.min, proj2.max)) {
      // 분리 축이 존재하면, 충돌하지 않음.
      return false;
    }
  }
  // 모든 축에서 투영 구간이 겹치면, 충돌하는 것으로 판별.
  return true;
}

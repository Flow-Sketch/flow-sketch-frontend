import { expect, test, describe } from '@jest/globals';
import { isOBBColliding } from '../obb.ts';
import { RectangleInfo } from '../common.ts';

describe('OBB Collision Detection', () => {
  test('충돌하는 직사각형: 두 OBB가 겹친 경우', () => {
    const rectA: RectangleInfo = {
      cx: 100,
      cy: 100,
      width: 80,
      height: 40,
      angle: Math.PI / 6, // 약 30도 회전
    };

    const rectB: RectangleInfo = {
      cx: 130,
      cy: 110,
      width: 50,
      height: 60,
      angle: -Math.PI / 8, // 약 -22.5도 회전
    };

    expect(isOBBColliding(rectA, rectB)).toBe(true);
  });

  test('충돌하지 않는 직사각형: 두 OBB가 떨어진 경우', () => {
    const rectA: RectangleInfo = {
      cx: 100,
      cy: 100,
      width: 80,
      height: 40,
      angle: Math.PI / 6,
    };

    const rectB: RectangleInfo = {
      cx: 300,
      cy: 300,
      width: 50,
      height: 60,
      angle: -Math.PI / 8,
    };

    expect(isOBBColliding(rectA, rectB)).toBe(false);
  });

  test('모서리 접촉: 직사각형이 가장자리를 맞닿은 경우', () => {
    // 회전 없이 축에 평행한 사각형
    const rectA: RectangleInfo = {
      cx: 100,
      cy: 100,
      width: 80,
      height: 40,
      angle: 0,
    };

    const rectB: RectangleInfo = {
      cx: 165,
      cy: 100,
      width: 50,
      height: 40,
      angle: 0,
    };

    // 이 구현에서는 경계가 딱 맞아떨어져도 겹치는 것으로 판단
    expect(isOBBColliding(rectA, rectB)).toBe(true);
  });

  test('실제 사례', () => {
    const rectA: RectangleInfo = {
      cx: 1740,
      cy: 1313.3333333,
      width: 2080,
      height: 1933.33333,
      angle: 0,
    };

    const rectB: RectangleInfo = {
      cx: 1200,
      cy: 2400,
      width: 300,
      height: 400,
      angle: 0,
    };

    expect(isOBBColliding(rectA, rectB)).toBe(true);
  });
});

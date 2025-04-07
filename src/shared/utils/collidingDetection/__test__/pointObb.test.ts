import { describe, test, expect } from '@jest/globals';
import { isPointInOBB } from '../obb.ts';

describe('isPointInOBB', () => {
  test('회전되지 않은 사각형 내부의 점 판별', () => {
    const rect = {
      cx: 100,
      cy: 100,
      width: 200,
      height: 100,
      rotation: 0,
    };

    // 내부 점들
    expect(isPointInOBB(rect, { x: 100, y: 100 })).toBe(true); // 중심점
    expect(isPointInOBB(rect, { x: 50, y: 75 })).toBe(true); // 왼쪽 상단 근처
    expect(isPointInOBB(rect, { x: 150, y: 125 })).toBe(true); // 오른쪽 하단 근처
    expect(isPointInOBB(rect, { x: 0, y: 100 })).toBe(true); // 왼쪽 가장자리
    expect(isPointInOBB(rect, { x: 200, y: 100 })).toBe(true); // 오른쪽 가장자리
    expect(isPointInOBB(rect, { x: 100, y: 50 })).toBe(true); // 위쪽 가장자리
    expect(isPointInOBB(rect, { x: 100, y: 150 })).toBe(true); // 아래쪽 가장자리

    // 외부 점들
    expect(isPointInOBB(rect, { x: -1, y: 100 })).toBe(false); // 왼쪽 바깥
    expect(isPointInOBB(rect, { x: 201, y: 100 })).toBe(false); // 오른쪽 바깥
    expect(isPointInOBB(rect, { x: 100, y: 49 })).toBe(false); // 위쪽 바깥
    expect(isPointInOBB(rect, { x: 100, y: 151 })).toBe(false); // 아래쪽 바깥
    expect(isPointInOBB(rect, { x: 300, y: 300 })).toBe(false); // 완전히 바깥
  });

  test('45도 회전된 정사각형 내부의 점 판별', () => {
    const rect = {
      cx: 100,
      cy: 100,
      width: 100,
      height: 100,
      rotation: Math.PI / 4, // 45도
    };

    // 내부 점들
    expect(isPointInOBB(rect, { x: 100, y: 100 })).toBe(true); // 중심점

    // 45도 회전된 정사각형의 꼭지점 근처 (내부)
    const d = 50 * 0.9; // 정사각형 변의 절반 길이의 90%
    expect(isPointInOBB(rect, { x: 100 + d * Math.cos(Math.PI / 4), y: 100 + d * Math.sin(Math.PI / 4) })).toBe(true); // 오른쪽 위
    expect(isPointInOBB(rect, { x: 100 - d * Math.cos(Math.PI / 4), y: 100 + d * Math.sin(Math.PI / 4) })).toBe(true); // 왼쪽 위
    expect(isPointInOBB(rect, { x: 100 - d * Math.cos(Math.PI / 4), y: 100 - d * Math.sin(Math.PI / 4) })).toBe(true); // 왼쪽 아래
    expect(isPointInOBB(rect, { x: 100 + d * Math.cos(Math.PI / 4), y: 100 - d * Math.sin(Math.PI / 4) })).toBe(true); // 오른쪽 아래

    // 외부 점들
    const dOut = 50 * 1.1; // 정사각형 변의 절반 길이의 110%
    expect(isPointInOBB(rect, { x: 100 + dOut * Math.cos(Math.PI / 4), y: 100 + dOut * Math.sin(Math.PI / 4) })).toBe(false); // 오른쪽 위 바깥
    expect(isPointInOBB(rect, { x: 100 - dOut * Math.cos(Math.PI / 4), y: 100 + dOut * Math.sin(Math.PI / 4) })).toBe(false); // 왼쪽 위 바깥
    expect(isPointInOBB(rect, { x: 100 - dOut * Math.cos(Math.PI / 4), y: 100 - dOut * Math.sin(Math.PI / 4) })).toBe(false); // 왼쪽 아래 바깥
    expect(isPointInOBB(rect, { x: 100 + dOut * Math.cos(Math.PI / 4), y: 100 - dOut * Math.sin(Math.PI / 4) })).toBe(false); // 오른쪽 아래 바깥
  });

  test('90도 회전된 직사각형 내부의 점 판별', () => {
    const rect = {
      cx: 100,
      cy: 100,
      width: 100,
      height: 200,
      rotation: Math.PI / 2, // 90도
    };

    // 내부 점들
    expect(isPointInOBB(rect, { x: 100, y: 100 })).toBe(true); // 중심점

    // 90도 회전된 직사각형의 가장자리 점들
    expect(isPointInOBB(rect, { x: 0, y: 100 })).toBe(true); // 왼쪽 가장자리
    expect(isPointInOBB(rect, { x: 200, y: 100 })).toBe(true); // 오른쪽 가장자리
    expect(isPointInOBB(rect, { x: 100, y: 150 })).toBe(true); // 위쪽 가장자리
    expect(isPointInOBB(rect, { x: 100, y: 50 })).toBe(true); // 아래쪽 가장자리

    // 내부의 임의의 점들
    expect(isPointInOBB(rect, { x: 75, y: 50 })).toBe(true); // 왼쪽 위 근처
    expect(isPointInOBB(rect, { x: 125, y: 150 })).toBe(true); // 오른쪽 아래 근처

    // 외부 점들
    expect(isPointInOBB(rect, { x: -1, y: 100 })).toBe(false); // 왼쪽 바깥
    expect(isPointInOBB(rect, { x: 201, y: 100 })).toBe(false); // 오른쪽 바깥
    expect(isPointInOBB(rect, { x: 100, y: 151 })).toBe(false); // 위쪽 바깥
    expect(isPointInOBB(rect, { x: 100, y: 49 })).toBe(false); // 아래쪽 바깥
    expect(isPointInOBB(rect, { x: 200, y: 200 })).toBe(false); // 완전히 바깥
  });

  test('30도 회전된 직사각형 내부의 점 판별', () => {
    const rect = {
      cx: 150,
      cy: 150,
      width: 200,
      height: 100,
      rotation: Math.PI / 6, // 30도
    };

    // 내부 점들
    expect(isPointInOBB(rect, { x: 150, y: 150 })).toBe(true); // 중심점

    // 30도 회전된 직사각형의 꼭지점 근처 (내부)
    const cosA = Math.cos(Math.PI / 6);
    const sinA = Math.sin(Math.PI / 6);
    const w = (200 / 2) * 0.9; // 너비의 절반의 90%
    const h = (100 / 2) * 0.9; // 높이의 절반의 90%

    // 오른쪽 위 꼭지점 근처
    expect(
      isPointInOBB(rect, {
        x: 150 + w * cosA - h * sinA,
        y: 150 + w * sinA + h * cosA,
      }),
    ).toBe(true);

    // 오른쪽 아래 꼭지점 근처
    expect(
      isPointInOBB(rect, {
        x: 150 + w * cosA + h * sinA,
        y: 150 + w * sinA - h * cosA,
      }),
    ).toBe(true);

    // 왼쪽 아래 꼭지점 근처
    expect(
      isPointInOBB(rect, {
        x: 150 - w * cosA + h * sinA,
        y: 150 - w * sinA - h * cosA,
      }),
    ).toBe(true);

    // 왼쪽 위 꼭지점 근처
    expect(
      isPointInOBB(rect, {
        x: 150 - w * cosA - h * sinA,
        y: 150 - w * sinA + h * cosA,
      }),
    ).toBe(true);

    // 외부 점들
    const wOut = (200 / 2) * 1.1; // 너비의 절반의 110%
    const hOut = (100 / 2) * 1.1; // 높이의 절반의 110%

    // 오른쪽 위 꼭지점 바깥
    expect(
      isPointInOBB(rect, {
        x: 150 + wOut * cosA - hOut * sinA,
        y: 150 + wOut * sinA + hOut * cosA,
      }),
    ).toBe(false);

    // 완전히 바깥
    expect(isPointInOBB(rect, { x: 300, y: 300 })).toBe(false);
  });

  test('임의의 회전각을 가진 사각형 내부의 점 판별', () => {
    const rect = {
      cx: 200,
      cy: 200,
      width: 150,
      height: 80,
      rotation: Math.PI / 3, // 60도
    };

    // 내부 점들
    expect(isPointInOBB(rect, { x: 200, y: 200 })).toBe(true); // 중심점

    // 회전된 사각형 내부의 임의의 점
    const cosA = Math.cos(Math.PI / 3);
    const sinA = Math.sin(Math.PI / 3);

    // 중심에서 약간 떨어진 내부 점
    expect(
      isPointInOBB(rect, {
        x: 200 + 20 * cosA - 10 * sinA,
        y: 200 + 20 * sinA + 10 * cosA,
      }),
    ).toBe(true);

    // 외부 점들
    // 사각형 크기보다 큰 거리에 있는 점
    expect(
      isPointInOBB(rect, {
        x: 200 + 100 * cosA - 50 * sinA,
        y: 200 + 100 * sinA + 50 * cosA,
      }),
    ).toBe(false);

    // 완전히 바깥
    expect(isPointInOBB(rect, { x: 400, y: 400 })).toBe(false);
  });
});

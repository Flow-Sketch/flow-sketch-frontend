import { describe, it, expect } from '@jest/globals';
import { isPointInAABB } from '@/shared/utils/collidingDetection/aabb';

describe('isPointInAABB', () => {
  // 테스트에서 사용할 기본 사각형 정의
  const testRect = {
    cx: 100, // 중심점 x
    cy: 100, // 중심점 y
    width: 50, // 너비
    height: 30, // 높이
  };

  it('사각형 내부의 점에 대해 true를 반환해야 함', () => {
    const insidePoints = [
      { x: 100, y: 100 }, // 중심점
      { x: 90, y: 90 }, // 좌상단 영역
      { x: 110, y: 90 }, // 우상단 영역
      { x: 90, y: 110 }, // 좌하단 영역
      { x: 110, y: 110 }, // 우하단 영역
    ];

    insidePoints.forEach((point) => {
      expect(isPointInAABB(testRect, point)).toBe(true);
    });
  });

  it('사각형 경계선 상의 점에 대해 true를 반환해야 함', () => {
    const boundaryPoints = [
      { x: 75, y: 100 }, // 왼쪽 경계
      { x: 125, y: 100 }, // 오른쪽 경계
      { x: 100, y: 85 }, // 위쪽 경계
      { x: 100, y: 115 }, // 아래쪽 경계
      { x: 75, y: 85 }, // 좌상단 모서리
      { x: 125, y: 85 }, // 우상단 모서리
      { x: 75, y: 115 }, // 좌하단 모서리
      { x: 125, y: 115 }, // 우하단 모서리
    ];

    boundaryPoints.forEach((point) => {
      expect(isPointInAABB(testRect, point)).toBe(true);
    });
  });

  it('사각형 외부의 점에 대해 false를 반환해야 함', () => {
    const outsidePoints = [
      { x: 74, y: 100 }, // 왼쪽 바깥
      { x: 126, y: 100 }, // 오른쪽 바깥
      { x: 100, y: 84 }, // 위쪽 바깥
      { x: 100, y: 116 }, // 아래쪽 바깥
      { x: 74, y: 84 }, // 좌상단 바깥
      { x: 126, y: 84 }, // 우상단 바깥
      { x: 74, y: 116 }, // 좌하단 바깥
      { x: 126, y: 116 }, // 우하단 바깥
    ];

    outsidePoints.forEach((point) => {
      expect(isPointInAABB(testRect, point)).toBe(false);
    });
  });

  it('극단적인 크기의 사각형에 대해서도 정상 동작해야 함', () => {
    const largeRect = {
      cx: 0,
      cy: 0,
      width: 1000,
      height: 1000,
    };

    const tinyRect = {
      cx: 0,
      cy: 0,
      width: 1,
      height: 1,
    };

    // 큰 사각형 테스트
    expect(isPointInAABB(largeRect, { x: 499, y: 499 })).toBe(true);
    expect(isPointInAABB(largeRect, { x: -499, y: -499 })).toBe(true);
    expect(isPointInAABB(largeRect, { x: 501, y: 0 })).toBe(false);

    // 작은 사각형 테스트
    expect(isPointInAABB(tinyRect, { x: 0, y: 0 })).toBe(true);
    expect(isPointInAABB(tinyRect, { x: 0.5, y: 0.5 })).toBe(true);
    expect(isPointInAABB(tinyRect, { x: -0.6, y: -0.6 })).toBe(false);
  });

  it('소수점 좌표에 대해서도 정상 동작해야 함', () => {
    const preciseRect = {
      cx: 10.5,
      cy: 10.5,
      width: 1,
      height: 1,
    };

    expect(isPointInAABB(preciseRect, { x: 10.5, y: 10.5 })).toBe(true);
    expect(isPointInAABB(preciseRect, { x: 9.5, y: 10.5 })).toBe(false);
    expect(isPointInAABB(preciseRect, { x: 10.99, y: 10.99 })).toBe(true);
    expect(isPointInAABB(preciseRect, { x: 11.01, y: 11.01 })).toBe(false);
  });
});

import { expect, test, describe } from '@jest/globals';
import { getBoundingBox } from '../boundingBox.ts';

describe('getBoundingBox', () => {
  test('단일 요소의 경계 상자 계산 (회전 없음)', () => {
    const elements = [
      {
        cx: 100,
        cy: 100,
        width: 200,
        height: 100,
        rotation: 0,
      },
    ];

    const boundingBox = getBoundingBox(elements);

    expect(boundingBox.minX).toBe(0);
    expect(boundingBox.maxX).toBe(200);
    expect(boundingBox.minY).toBe(50);
    expect(boundingBox.maxY).toBe(150);
    expect(boundingBox.cx).toBe(100);
    expect(boundingBox.cy).toBe(100);
    expect(boundingBox.width).toBe(200);
    expect(boundingBox.height).toBe(100);
  });

  test('단일 요소의 경계 상자 계산 (45도 회전)', () => {
    const elements = [
      {
        cx: 100,
        cy: 100,
        width: 100,
        height: 100,
        rotation: Math.PI / 4, // 45도
      },
    ];

    const boundingBox = getBoundingBox(elements);

    // 45도 회전된 정사각형의 경계 상자는 원래 크기의 약 1.414배
    const expectedHalfDiagonal = 50 * Math.sqrt(2);

    expect(boundingBox.minX).toBeCloseTo(100 - expectedHalfDiagonal);
    expect(boundingBox.maxX).toBeCloseTo(100 + expectedHalfDiagonal);
    expect(boundingBox.minY).toBeCloseTo(100 - expectedHalfDiagonal);
    expect(boundingBox.maxY).toBeCloseTo(100 + expectedHalfDiagonal);
    expect(boundingBox.cx).toBeCloseTo(100);
    expect(boundingBox.cy).toBeCloseTo(100);
    expect(boundingBox.width).toBeCloseTo(2 * expectedHalfDiagonal);
    expect(boundingBox.height).toBeCloseTo(2 * expectedHalfDiagonal);
  });

  test('여러 요소의 경계 상자 계산', () => {
    const elements = [
      {
        cx: 100,
        cy: 100,
        width: 100,
        height: 100,
        rotation: 0,
      },
      {
        cx: 300,
        cy: 200,
        width: 100,
        height: 100,
        rotation: 0,
      },
    ];

    const boundingBox = getBoundingBox(elements);

    expect(boundingBox.minX).toBe(50);
    expect(boundingBox.maxX).toBe(350);
    expect(boundingBox.minY).toBe(50);
    expect(boundingBox.maxY).toBe(250);
    expect(boundingBox.cx).toBe(200);
    expect(boundingBox.cy).toBe(150);
    expect(boundingBox.width).toBe(300);
    expect(boundingBox.height).toBe(200);
  });

  test('여러 요소의 경계 상자 계산 (회전 포함)', () => {
    const elements = [
      {
        cx: 100,
        cy: 100,
        width: 100,
        height: 100,
        rotation: Math.PI / 4, // 45도
      },
      {
        cx: 300,
        cy: 200,
        width: 100,
        height: 100,
        rotation: Math.PI / 2, // 90도
      },
    ];

    const boundingBox = getBoundingBox(elements);

    // 첫 번째 요소 (45도 회전)
    const diag1 = 50 * Math.sqrt(2);

    // 두 번째 요소 (90도 회전)
    // 90도 회전된 사각형은 원래 크기와 동일한 경계 상자를 가짐

    expect(boundingBox.minX).toBeCloseTo(100 - diag1);
    expect(boundingBox.maxX).toBeCloseTo(350);
    expect(boundingBox.minY).toBeCloseTo(100 - diag1);
    expect(boundingBox.maxY).toBeCloseTo(250);

    // 중심점과 크기 테스트
    const expectedCX = (100 - diag1 + 350) / 2;
    const expectedCY = (100 - diag1 + 250) / 2;
    expect(boundingBox.cx).toBeCloseTo(expectedCX);
    expect(boundingBox.cy).toBeCloseTo(expectedCY);
    expect(boundingBox.width).toBeCloseTo(350 - (100 - diag1));
    expect(boundingBox.height).toBeCloseTo(250 - (100 - diag1));
  });

  test('빈 배열 입력 시 무한대 값 반환', () => {
    const elements: any[] = [];

    const boundingBox = getBoundingBox(elements);

    expect(boundingBox.minX).toBe(Infinity);
    expect(boundingBox.maxX).toBe(-Infinity);
    expect(boundingBox.minY).toBe(Infinity);
    expect(boundingBox.maxY).toBe(-Infinity);
    expect(boundingBox.cx).toBe(NaN); // (Infinity + -Infinity) / 2 = NaN
    expect(boundingBox.cy).toBe(NaN);
    expect(boundingBox.width).toBe(-Infinity); // (-Infinity - Infinity) = -Infinity
    expect(boundingBox.height).toBe(-Infinity);
  });

  test('직사각형 요소의 경계 상자 계산 (30도 회전)', () => {
    const elements = [
      {
        cx: 150,
        cy: 150,
        width: 200,
        height: 100,
        rotation: Math.PI / 6, // 30도
      },
    ];

    const boundingBox = getBoundingBox(elements);

    // 30도 회전된 직사각형의 경계 상자 계산
    const cosA = Math.cos(Math.PI / 6);
    const sinA = Math.sin(Math.PI / 6);
    const halfWidth = 100;
    const halfHeight = 50;

    // 회전된 사각형의 꼭지점 좌표 계산
    const corners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ].map(({ x, y }) => ({
      x: 150 + (x * cosA - y * sinA),
      y: 150 + (x * sinA + y * cosA),
    }));

    // 예상되는 경계 상자 계산
    const expectedMinX = Math.min(...corners.map((p) => p.x));
    const expectedMaxX = Math.max(...corners.map((p) => p.x));
    const expectedMinY = Math.min(...corners.map((p) => p.y));
    const expectedMaxY = Math.max(...corners.map((p) => p.y));

    expect(boundingBox.minX).toBeCloseTo(expectedMinX);
    expect(boundingBox.maxX).toBeCloseTo(expectedMaxX);
    expect(boundingBox.minY).toBeCloseTo(expectedMinY);
    expect(boundingBox.maxY).toBeCloseTo(expectedMaxY);
    expect(boundingBox.cx).toBeCloseTo((expectedMinX + expectedMaxX) / 2);
    expect(boundingBox.cy).toBeCloseTo((expectedMinY + expectedMaxY) / 2);
    expect(boundingBox.width).toBeCloseTo(expectedMaxX - expectedMinX);
    expect(boundingBox.height).toBeCloseTo(expectedMaxY - expectedMinY);
  });

  test('다양한 크기와 회전을 가진 여러 요소의 경계 상자 계산', () => {
    const elements = [
      {
        cx: 100,
        cy: 100,
        width: 50,
        height: 150,
        rotation: Math.PI / 3, // 60도
      },
      {
        cx: 250,
        cy: 150,
        width: 120,
        height: 80,
        rotation: Math.PI / 4, // 45도
      },
      {
        cx: 400,
        cy: 200,
        width: 100,
        height: 200,
        rotation: 0, // 회전 없음
      },
    ];

    const boundingBox = getBoundingBox(elements);

    // 경계 상자가 모든 요소를 포함하는지 확인
    expect(boundingBox.minX).toBeLessThan(100);
    expect(boundingBox.maxX).toBeGreaterThan(400);
    expect(boundingBox.minY).toBeLessThan(100);
    expect(boundingBox.maxY).toBeGreaterThan(200);

    // 중심점이 대략적으로 요소들 사이에 위치하는지 확인
    expect(boundingBox.cx).toBeGreaterThan(100);
    expect(boundingBox.cx).toBeLessThan(400);
    expect(boundingBox.cy).toBeGreaterThan(50);
    expect(boundingBox.cy).toBeLessThan(250);

    // 너비와 높이가 양수인지 확인
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
  });
});

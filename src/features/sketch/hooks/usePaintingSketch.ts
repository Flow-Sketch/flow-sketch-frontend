import * as React from 'react';
import { useEffect } from 'react';
import { colorToken } from '@/shared/styles/color';
import { SelectManagerState, ViewManagerState, CreateElementManagerState, CreateLineManagerState } from '@/features/sketch/hooks/index.ts';
import { ElementRegistry } from '@/core/models/sketchFile';

/**
 * ### usePaintingSketch()
 * #### 설명
 * - 주어진 캔버스 ref 와 요소 레지스트리를 바탕으로 캔버스에 그림으로 표현
 * - `view` 상태를 기반으로 캔버스의 배율 및 위치를 조정
 * - `select` 상태를 기반으로 캔버스 내의 선택된 요소 및 dragBox 표시
 *
 * @param canvasRef - HTMLCanvasElement에 대한 참조 객체
 * @param state - 캔버스 렌더링에 필요한 모든 상태를 포함하는 객체
 *   - `elementRegistry`: 캔버스에 그릴 요소들의 레지스트리 (요소 목록 및 레이어 순서)
 *   - `viewState`: 캔버스의 뷰 상태 (배율 및 오프셋)
 *   - `selectState`: 선택 상태 (드래그 박스의 시작 및 끝 지점, 선택된 요소들)
 *   - `createState`: 객체 생성 상태 (가이드 박스의 시작 및 끝 지점, 생성 객체 타입)
 */
export function usePaintingSketch(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  state: {
    elementRegistry: ElementRegistry;
    viewState: ViewManagerState;
    selectState: SelectManagerState;
    createState: CreateElementManagerState;
    createLineState: CreateLineManagerState;
  },
) {
  const { elementRegistry, viewState, selectState, createState, createLineState } = state;
  useEffect(() => {
    const { elements, layerOrder } = elementRegistry;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배율과 변환 상태를 저장
    ctx.save();
    ctx.translate(viewState.offset.x, viewState.offset.y);
    ctx.scale(viewState.scale, viewState.scale);

    // 요소 그리기
    for (const elementId of layerOrder) {
      elements[elementId].draw(ctx);
    }

    // 변환 상태 복원
    ctx.restore();

    if (selectState.selectElements.length > 0) {
      if (!selectState.boundingBox) return;

      const { cx, cy, width, height } = selectState.boundingBox;

      ctx.save();
      const resizeAnchorWidth = 8; // 앵커의 길이
      const resizeAnchorRadius = 2; // 모서리 반경 설정
      const resizeAnchorPosition = [
        { x: cx - width / 2, y: cy - height / 2 }, // 왼쪽 상단
        { x: cx - width / 2, y: cy + height / 2 }, // 왼쪽 하단
        { x: cx + width / 2, y: cy - height / 2 }, // 오른쪽 상단
        { x: cx + width / 2, y: cy + height / 2 }, // 오른쪽 하단
      ];

      // 스타일 적용
      ctx.lineWidth = 2;
      ctx.strokeStyle = colorToken['focusColor'];
      ctx.fillStyle = 'transparent';

      // 사각형 그리기
      ctx.beginPath(); // 다른 도형들과 분리되어 독립적으로 처리
      ctx.rect(cx - width / 2, cy - height / 2, width, height);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();

      // 앵커 사각형 그리기
      for (const anchorPosition of resizeAnchorPosition) {
        const { x, y } = anchorPosition;
        ctx.lineWidth = 3;
        ctx.strokeStyle = colorToken['focusColor'];
        ctx.fillStyle = colorToken['white'];

        ctx.beginPath();
        ctx.roundRect(x - resizeAnchorWidth / 2, y - resizeAnchorWidth / 2, resizeAnchorWidth, resizeAnchorWidth, resizeAnchorRadius);
        ctx.stroke();
        ctx.fill();
      }
      ctx.restore();
    }

    // 선택 박스 그리기
    if (selectState.dragBox.startPoint && selectState.dragBox.endPoint) {
      const { startPoint, endPoint } = selectState.dragBox;

      ctx.lineWidth = 2;
      ctx.strokeStyle = colorToken['dragColor'];
      ctx.fillStyle = colorToken['dragBackground'];

      ctx.beginPath();
      ctx.rect(
        Math.min(startPoint.x, endPoint.x),
        Math.min(startPoint.y, endPoint.y),
        Math.abs(startPoint.x - endPoint.x),
        Math.abs(startPoint.y - endPoint.y),
      );
      ctx.fill();
      ctx.stroke();
    }

    // 도형(객체) 생성 가이드박스
    if (createState.guideBox.startPoint && createState.guideBox.endPoint) {
      const { startPoint, endPoint } = createState.guideBox;

      ctx.lineWidth = 2;
      ctx.strokeStyle = colorToken['focusColor'];
      ctx.fillStyle = 'transparent';

      ctx.beginPath();
      ctx.rect(
        Math.min(startPoint.x, endPoint.x),
        Math.min(startPoint.y, endPoint.y),
        Math.abs(startPoint.x - endPoint.x),
        Math.abs(startPoint.y - endPoint.y),
      );
      ctx.fill();
      ctx.stroke();
    }

    // 선(객체) 생성 가이드박스
    if (createLineState.dragElement.startPoint && createLineState.dragElement.endPoint) {
      const { startPoint, endPoint } = createLineState.dragElement;

      ctx.lineWidth = 2;
      ctx.strokeStyle = colorToken['focusColor'];
      ctx.fillStyle = 'transparent';

      ctx.beginPath();
      ctx.rect(
        Math.min(startPoint.x, endPoint.x),
        Math.min(startPoint.y, endPoint.y),
        Math.abs(startPoint.x - endPoint.x),
        Math.abs(startPoint.y - endPoint.y),
      );
      ctx.fill();
      ctx.stroke();
    }
  }, [elementRegistry, viewState, selectState]);
}

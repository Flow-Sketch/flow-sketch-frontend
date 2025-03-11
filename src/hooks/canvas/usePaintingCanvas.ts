import * as React from 'react';
import { ElementRegistry } from '@/hooks/canvas/useCanvasElementManager.ts';
import { ViewManagerState } from '@/hooks/canvas/useCanvasViewManager.ts';
import { useEffect } from 'react';
import { SelectManagerState } from '@/hooks/canvas/useCanvasSelectElementManager.ts';
import { colorToken } from '@/style/color';
import { CreateElementManagerState } from '@/hooks/canvas/useCanvasCreateElementManger.ts';

/**
 * ### usePaintingCanvas()
 * #### 설명
 * - 주어진 캔버스 ref 와 요소 레지스트리를 바탕으로 캔버스에 그림으로 표현
 * - `view` 상태를 기반으로 캔버스의 배율 및 위치를 조정
 * - `select` 상태를 기반으로 캔버스 내의 선택된 요소 및 dragBox 표시
 *
 * @param canvasRef - HTMLCanvasElement에 대한 참조 객체
 * @param registry - 캔버스에 그릴 요소들의 레지스트리
 * @param viewState - 캔버스의 뷰 상태 (배율 및 오프셋)
 * @param selectState - 선택 상태 (드래그 박스의 시작 및 끝 지점)
 * @param createState - 객체 생성 상태 (가이드 박스의 시작 및 끝 지점, 생성객체타입)
 */
export function usePaintingCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  registry: ElementRegistry,
  viewState: ViewManagerState,
  selectState: SelectManagerState,
  createState: CreateElementManagerState,
) {
  useEffect(() => {
    const { elements, layerOrder } = registry;
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

    // 1개의 선택된 요소 그리기
    if (Object.keys(selectState.selectElement).length === 1) {
      const objectKeys = Object.keys(selectState.selectElement);
      for (const elementId of objectKeys) {
        selectState.selectElement[elementId].draw(ctx);
      }
    }

    if (Object.keys(selectState.selectElement).length > 1) {
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
  }, [registry, viewState, selectState]);
}

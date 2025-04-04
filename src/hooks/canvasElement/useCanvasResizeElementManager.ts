import * as React from 'react';
import { MouseEvent, useState } from 'react';
import { TRANSFORM_CONTROL_CORNER_WIDTH, TRANSFORM_CONTROL_SIDE_WIDTH } from '@/constants';
import { SelectManagerState, ElementRegistryAction } from 'src/hooks/canvasElement';
import { useCanvasViewStore, useElementRegistryStore } from 'src/stores';
import { isPointInOBB } from '@/utils/collidingDetection';

// 리사이즈 핸들 위치 타입 정의
export type ResizeHandlePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left' | null;

export type ResizeManagerAction = {
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
};

/**
 * ### useCanvasResizeElementManager
 *
 * #### 설명
 * - 선택된 요소들의 크기를 조절하는 기능을 제공하는 훅
 * - 바운딩 박스의 모서리나 가장자리를 드래그하여 요소의 크기를 변경
 *
 * @param viewState - 캔버스 뷰 상태
 * @param selectState - 선택 상태
 * @param elementRegistryAction - 요소 레지스트리 액션
 * @returns 리사이즈 관련 액션
 */
export function useCanvasResizeElementManager(elementRegistryAction: ElementRegistryAction): {
  resizeAction: ResizeManagerAction;
} {
  const userId = 'testUser';
  const viewState = useCanvasViewStore();
  const selectState = useElementRegistryStore((store) => store.selectElement[userId]);

  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null); // 리사이즈 시작 위치
  const [isResizing, setIsResizing] = useState<boolean>(false); // 현재 드래그 중인지 여부
  const [activeHandle, setActiveHandle] = useState<ResizeHandlePosition>(null); // 현재 드래그 중인 핸들 위치
  const [initialBoundingBox, setInitialBoundingBox] = useState<{
    cx: number;
    cy: number;
    width: number;
    height: number;
  } | null>(null); // 리사이즈 시작 시 바운딩 박스 초기 크기

  /**
   * 마우스 다운 이벤트 핸들러
   * 리사이즈 시작 위치와 활성 핸들을 설정
   */
  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!event) return;

    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    // 선택된 요소가 없으면 리턴
    if (Object.keys(selectState.elements).length === 0) return;

    // 마우스 위치가 어떤 핸들 위에 있는지 확인
    const handlePosition = getResizeHandleAtPosition(currentX, currentY, selectState.boundingBox);

    if (handlePosition) {
      setActiveHandle(handlePosition);
      setStartPoint({ x: currentX, y: currentY });
      setInitialBoundingBox({ ...selectState.boundingBox });
      setIsResizing(true);
    }
  };

  /**
   * 마우스 이동 이벤트 핸들러
   * 활성 핸들에 따라 요소 크기 조절
   */
  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!event || !isResizing || !startPoint || !initialBoundingBox || !activeHandle) return;

    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    // 마우스 이동 거리 계산 (스케일 고려)
    const deltaX = (currentX - startPoint.x) / viewState.scale;
    const deltaY = (currentY - startPoint.y) / viewState.scale;

    // 선택된 모든 요소에 대해 크기 조절 적용
    for (const selectKey of Object.keys(selectState.elements)) {
      elementRegistryAction.resizeElement(selectKey, {
        resizeX: deltaX,
        resizeY: deltaY,
        pointDirection: activeHandle.split('-') as ('top' | 'right' | 'bottom' | 'left')[],
      });
    }

    setStartPoint({ x: currentX, y: currentY });
  };

  /**
   * 마우스 업 이벤트 핸들러
   * 리사이즈 상태 초기화
   */
  const handleMouseUp = () => {
    if (!isResizing) return;

    setIsResizing(false);
    setStartPoint(null);
    setInitialBoundingBox(null);
    setActiveHandle(null);
  };

  return {
    resizeAction: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    },
  };
}

/**
 * 마우스 위치가 어떤 리사이즈 핸들 위에 있는지 확인
 * @param mouseX - 마우스 X 좌표
 * @param mouseY - 마우스 Y 좌표
 * @param boundingBox - 바운딩 박스
 * @returns 리사이즈 핸들 위치 또는 null
 */
function getResizeHandleAtPosition(mouseX: number, mouseY: number, boundingBox: SelectManagerState['boundingBox']): ResizeHandlePosition {
  const { cx, cy, width, height } = boundingBox;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // 모서리 핸들 (코너)
  const cornerSize = TRANSFORM_CONTROL_CORNER_WIDTH;
  const topLeft = isPointInOBB(
    { cx: cx - halfWidth, cy: cy - halfHeight, width: cornerSize, height: cornerSize, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (topLeft) return 'top-left';

  const topRight = isPointInOBB(
    { cx: cx + halfWidth, cy: cy - halfHeight, width: cornerSize, height: cornerSize, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (topRight) return 'top-right';

  const bottomLeft = isPointInOBB(
    { cx: cx - halfWidth, cy: cy + halfHeight, width: cornerSize, height: cornerSize, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (bottomLeft) return 'bottom-left';

  const bottomRight = isPointInOBB(
    { cx: cx + halfWidth, cy: cy + halfHeight, width: cornerSize, height: cornerSize, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (bottomRight) return 'bottom-right';

  // 가장자리 핸들 (사이드)
  const sideWidth = TRANSFORM_CONTROL_SIDE_WIDTH;

  const top = isPointInOBB(
    { cx: cx, cy: cy - halfHeight, width: width - cornerSize * 2, height: sideWidth, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (top) return 'top';

  const right = isPointInOBB(
    { cx: cx + halfWidth, cy: cy, width: sideWidth, height: height - cornerSize * 2, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (right) return 'right';

  const bottom = isPointInOBB(
    { cx: cx, cy: cy + halfHeight, width: width - cornerSize * 2, height: sideWidth, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (bottom) return 'bottom';

  const left = isPointInOBB(
    { cx: cx - halfWidth, cy: cy, width: sideWidth, height: height - cornerSize * 2, rotation: 0 },
    { x: mouseX, y: mouseY },
  );
  if (left) return 'left';

  return null;
}

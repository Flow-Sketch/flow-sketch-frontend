import { BaseSelectBox } from '@/core/models/selectionBox';
import { SketchElement } from '@/core/models/sketchElement';
import { ViewState } from '@/core/stores';
import { OnlyClassProperties } from '@/shared/utils/common';

/**
 * ### convertSelectBoxList
 *
 * #### 설명
 * - 스케치 요소 목록을 선택박스(SelectBox) 목록으로 변환하는 함수
 * - 각 요소의 위치, 크기, 회전 정보를 유지하면서 현재 뷰포트의 상태(오프셋, 스케일)를 반영
 *   > 뷰포트 기준으로 변환해야 확대/축소를 진행해도 SelectBox 가 화면에 제대로 표시됨
 *
 * @param elementList - 변환할 스케치 요소 목록
 * @param viewState - 현재 캔버스의 뷰포트 상태 (오프셋, 스케일)
 *
 * @returns BaseSelectBox[] - 선택 박스 객체 배열
 *
 * @example
 * const elements = [rect1, circle1];
 * const viewState = { offset: { x: 100, y: 100 }, scale: 1.5 };
 * const selectBoxes = convertSelectBoxList(elements, viewState);
 *
 * @remarks
 * - 빈 요소 목록이 입력되면 빈 배열을 반환
 * - 각 요소의 고유 ID를 유지하여 선택 상태 추적 가능
 * - 뷰포트 변환이 적용된 선택 박스 생성
 */
export function convertSelectBoxList(elementList: OnlyClassProperties<SketchElement>[], viewState: ViewState) {
  if (elementList.length === 0) return [];

  return elementList.map(
    (element) =>
      new BaseSelectBox({
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        offsetX: viewState.offset.x,
        offsetY: viewState.offset.y,
        rotation: element.rotation,
        scale: viewState.scale,
      }),
  );
}

import { BaseSelectBox } from '@/core/models/selectionBox';
import { BaseSketchElement } from '@/core/models/sketchElement';
import { ViewState } from '@/core/stores';
import { OnlyClassProperties } from '@/shared/utils/common';

export function convertSelectBoxList(elementList: OnlyClassProperties<BaseSketchElement>[], viewState: ViewState) {
  if (elementList.length < 0) return [];

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

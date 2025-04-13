import { ReactNode, useCallback, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from '@/shared/components/ui/context-menu.tsx';
import { ClipboardManagerAction, DeleteManagerAction, SelectManagerState } from '@/features/sketch/hooks';
import { isPointInAABB } from '@/shared/utils/collidingDetection';

interface SketchContextMenu {
  children: ReactNode;
  selectState: SelectManagerState;
  clipboardAction: ClipboardManagerAction;
  deleteAction: DeleteManagerAction;
}

export const SketchContextMenu = ({ children, selectState, clipboardAction, deleteAction }: SketchContextMenu) => {
  const [menuMode, setMenuMode] = useState<'selection' | 'default'>('default');

  const handleChangeMenu = useCallback(
    (event: any) => {
      const clientX = event.clientX;
      const clientY = event.clientY;
      if (isPointInAABB(selectState.boundingBox, { x: clientX, y: clientY })) {
        setMenuMode('selection');
      } else {
        setMenuMode('default');
      }
    },
    [selectState.boundingBox],
  );

  const handlePasteAtPosition = (event: any) => {
    const cx = event.clientX;
    const cy = event.clientY;
    clipboardAction.handlePasteElementAtPosition({ cx, cy });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={handleChangeMenu}>{children}</ContextMenuTrigger>
      {menuMode === 'selection' && (
        <ContextMenuContent className="w-54">
          <ContextMenuItem onClick={clipboardAction.handleCopyElement}>
            Copy
            <ContextMenuShortcut>⌘c</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={clipboardAction.handlePasteElement}>
            Paste
            <ContextMenuShortcut>⌘v</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={deleteAction.handleDeleteElements}>
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem disabled>
            Bring to Front
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Send to Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      {menuMode === 'default' && (
        <ContextMenuContent className="w-54">
          <ContextMenuItem onClick={handlePasteAtPosition}>
            Paste
            <ContextMenuShortcut>⌘v</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

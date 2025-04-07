import { ChangeEvent, useState } from 'react';
import { Separator } from '@/shared/components/ui/separator.tsx';
import { Card, CardContent, CardDescription, CardTitle } from '@/shared/components/ui/card.tsx';
import FlowSketchGray from '@/shared/assets/FlowSketch-gray.svg';
import { CanvasMetadata } from '@/core/models/sketchFile';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/app/route';
import { Button } from '@/shared/components/ui/button.tsx';
import { MoreVertical, Trash2, Pencil, StickyNote } from 'lucide-react';
import { useDeleteSketchFileManager } from '@/features/sketchFiles/hooks/useDeleteSketchFileManager.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import { useEditSketchFileManager } from '@/features/sketchFiles/hooks';

interface CanvasItemCardProps {
  canvasMeta: CanvasMetadata;
}

export const SketchCard = ({ canvasMeta }: CanvasItemCardProps) => {
  const navigate = useNavigate();
  const { deleteCanvas } = useDeleteSketchFileManager();
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  const handleClick = () => {
    navigate(`${ROUTE_PATH.CANVAS.ROOT}/${canvasMeta.id}`);
  };

  const handleCanvasDelete = () => {
    deleteCanvas(canvasMeta.id);
  };

  return (
    <Card>
      <CardContent onClick={handleClick} className="hover: cursor-pointer">
        <div className="flex self-stretch justify-center">
          <img src={FlowSketchGray} className="w-1/2" alt="Flow Sketch logo" />
        </div>
      </CardContent>
      <Separator />
      <CardContent>
        <div className="flex self-stretch justify-between">
          <div onClick={handleClick} className="flex flex-col self-stretch justify-between hover: cursor-pointer gap-2">
            <CardTitle>{canvasMeta.name}</CardTitle>
            <CardDescription>{canvasMeta.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditNameOpen(true)}>
                <Pencil />
                <p>이름 변경</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsMemoOpen(true)}>
                <StickyNote />
                <p>메모</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCanvasDelete}>
                <Trash2 />
                <p>삭제</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
            <EditNameDialog canvasMeta={canvasMeta} onClose={() => setIsEditNameOpen(false)} />
          </Dialog>

          <Dialog open={isMemoOpen} onOpenChange={setIsMemoOpen}>
            <MemoDialog canvasMeta={canvasMeta} onClose={() => setIsMemoOpen(false)} />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const EditNameDialog = ({ canvasMeta, onClose }: { canvasMeta: CanvasMetadata; onClose: () => void }) => {
  const { editAction } = useEditSketchFileManager();
  const [editName, setEditName] = useState<string>(canvasMeta.name);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(event.target.value);
  };

  const handleSaveName = () => {
    const updateCanvasMeta = { ...canvasMeta };
    updateCanvasMeta.name = editName;
    editAction.editMetaBoard(updateCanvasMeta.id, updateCanvasMeta);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>캔버스 이름 변경</DialogTitle>
        <DialogDescription>변경할 캔버스의 이름을 입력해주세요.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Input id="name" defaultValue={editName} onChange={handleChangeName} className="col-span-4" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSaveName}>
          저장
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const MemoDialog = ({ canvasMeta, onClose }: { canvasMeta: CanvasMetadata; onClose: () => void }) => {
  const { editAction } = useEditSketchFileManager();
  const [editMemo, setEditMemo] = useState<string>(canvasMeta.name);

  const handleChangeMemo = (event: ChangeEvent<HTMLInputElement>) => {
    setEditMemo(event.target.value);
  };

  const handleSaveMemo = () => {
    const updateCanvasMeta = { ...canvasMeta };
    updateCanvasMeta.description = editMemo;
    editAction.editMetaBoard(updateCanvasMeta.id, updateCanvasMeta);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>캔버스 메모</DialogTitle>
        <DialogDescription>캔버스에 대한 메모를 입력해주세요.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Input id="memo" defaultValue={canvasMeta.description} onChange={handleChangeMemo} className="col-span-4" />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSaveMemo} type="submit">
          저장
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

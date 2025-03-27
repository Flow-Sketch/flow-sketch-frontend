import { Separator } from '@/components/ui/separator.tsx';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card.tsx';
import FlowSketchGray from '@/assets/FlowSketch-gray.svg';
import { CanvasMetadata } from '@/models/canvasRegistry';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/routes';
import { Button } from '@/components/ui/button.tsx';
import { MoreVertical, Trash2, Pencil, StickyNote } from 'lucide-react';
import { useDeleteCanvasBoardManager } from '@/hooks/canvasBoard/useDeleteCanvasBoardManager.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useState } from 'react';

interface CanvasItemCardProps {
  canvasMeta: CanvasMetadata;
}

export const CanvasItemCard = ({ canvasMeta }: CanvasItemCardProps) => {
  const navigate = useNavigate();
  const { deleteCanvas } = useDeleteCanvasBoardManager();

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
          <div onClick={handleClick} className="flex self-stretch justify-between hover: cursor-pointer">
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
            <EditNameDialog canvasMeta={canvasMeta} />
          </Dialog>

          <Dialog open={isMemoOpen} onOpenChange={setIsMemoOpen}>
            <MemoDialog canvasMeta={canvasMeta} />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const EditNameDialog = ({ canvasMeta }: { canvasMeta: CanvasMetadata }) => (
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>캔버스 이름 변경</DialogTitle>
      <DialogDescription>변경할 캔버스의 이름을 입력해주세요.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Input id="name" defaultValue={canvasMeta.name} className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">저장</Button>
    </DialogFooter>
  </DialogContent>
);

const MemoDialog = ({ canvasMeta }: { canvasMeta: CanvasMetadata }) => (
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>캔버스 메모</DialogTitle>
      <DialogDescription>캔버스에 대한 메모를 입력해주세요.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Input id="memo" defaultValue={canvasMeta.description} className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">저장</Button>
    </DialogFooter>
  </DialogContent>
);

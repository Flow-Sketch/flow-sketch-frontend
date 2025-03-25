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

interface CanvasItemCardProps {
  canvasMeta: CanvasMetadata;
}

export const CanvasItemCard = ({ canvasMeta }: CanvasItemCardProps) => {
  const navigate = useNavigate();
  const { deleteCanvas } = useDeleteCanvasBoardManager();

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
              <DropdownMenuItem>
                <Pencil />
                <p>이름 변경</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StickyNote />
                <p>메모</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCanvasDelete}>
                <Trash2 />
                <p>삭제</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

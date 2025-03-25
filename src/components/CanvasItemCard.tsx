import { Separator } from '@/components/ui/separator.tsx';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card.tsx';
import FlowSketchGray from '@/assets/FlowSketch-gray.svg';
import { CanvasMetadata } from '@/models/canvasRegistry';
interface CanvasItemCardProps {
  canvasMeta: CanvasMetadata;
}

export const CanvasItemCard = ({ canvasMeta }: CanvasItemCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex self-stretch justify-center">
          <img src={FlowSketchGray} className="w-1/2" alt="Flow Sketch logo" />
        </div>
      </CardContent>
      <Separator />
      <CardContent>
        <CardTitle>{canvasMeta.name}</CardTitle>
        <CardDescription>{canvasMeta.description}</CardDescription>
      </CardContent>
    </Card>
  );
};

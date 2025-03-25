import { Separator } from '@/components/ui/separator.tsx';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card.tsx';
import FlowSketchGray from '@/assets/FlowSketch-gray.svg';

export const CanvasItemCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex self-stretch justify-center">
          <img src={FlowSketchGray} className="w-1/2" alt="Flow Sketch logo" />
        </div>
      </CardContent>
      <Separator />
      <CardContent>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardContent>
    </Card>
  );
};

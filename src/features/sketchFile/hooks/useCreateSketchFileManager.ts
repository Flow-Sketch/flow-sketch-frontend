import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useSketchFilesRegistry } from '@/features/sketchFile/hooks/index.ts';
import { ROUTE_PATH } from '@/routes';

export function useCreateSketchFileManager() {
  const navigate = useNavigate();
  const { boardAction } = useSketchFilesRegistry();

  function createCanvas() {
    const id = uuidv4(); // 새로운 canvasId 발급
    boardAction.createBoard(id);
    navigate(`${ROUTE_PATH.CANVAS.ROOT}/${id}`);
  }

  return {
    createCanvas,
  };
}

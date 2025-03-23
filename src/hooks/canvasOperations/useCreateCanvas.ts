import { v4 as uuidv4 } from 'uuid';
import { createCanvasRegistry } from '@/models/canvasRegistry';

export function useCreateCanvas() {
  const userId = 'testUser'; // 임시로 userId 처리
  const isAuth = true; // 임시로 auth 처리

  function createCanvas() {
    if (isAuth) {
      const id = uuidv4();
      const newCanvasRegistry = createCanvasRegistry({ userId });
      localStorage.setItem(id, JSON.stringify(newCanvasRegistry));
    }
  }

  return {
    createCanvas,
  };
}

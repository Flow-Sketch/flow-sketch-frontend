import { useState, useEffect } from 'react';

/**
 * ### 목적
 * > 브라우저 창의 크기를 실시간으로 추적하는 훅
 *
 * ### 설명
 * - 브라우저 창의 너비와 높이를 실시간으로 감지하고 반환
 * - resize 이벤트를 감지하여 창 크기가 변경될 때마다 상태를 업데이트
 *
 * @returns {{width: number, height: number}}
 * - width: 브라우저 창의 너비 (픽셀)
 * - height: 브라우저 창의 높이 (픽셀)
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { width, height } = useWindowSize();
 *   return (
 *     <div>
 *       현재 창 크기: {width} x {height}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - 컴포넌트가 마운트될 때 초기 크기를 설정
 * - resize 이벤트에 대한 이벤트 리스너를 자동으로 관리
 * - 컴포넌트가 언마운트될 때 이벤트 리스너를 정리
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // 초기 값 세팅
    handleResize();

    // 정리 함수
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

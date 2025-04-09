// 클래스의 속성만 추출하는 타입
export type OnlyClassProperties<T> = {
  [K in keyof T as T[K] extends (...args: unknown[]) => unknown ? never : K]: T[K];
};

// 클래스의 메소드만 추출하는 타입
export type OnlyClassMethods<T> = {
  [K in keyof T as T[K] extends (...args: unknown[]) => unknown ? K : never]: T[K];
};

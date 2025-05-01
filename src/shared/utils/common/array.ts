export function getArrayFirst<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

export function getArrayLast<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

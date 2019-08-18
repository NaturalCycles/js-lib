export async function pDelay<T> (ms: number = 0, value?: T): Promise<T> {
  return new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
}

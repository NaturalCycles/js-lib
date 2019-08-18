/**
 * Returns Promise that never resolves ("hanging").
 */
export async function pHang (): Promise<never> {
  return new Promise<never>(() => void 0)
}

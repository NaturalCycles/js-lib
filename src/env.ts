/**
 * Use it to detect SSR/Node.js environment.
 *
 * Will return `true` in Node.js.
 * Will return `false` in the Browser.
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined'
}

/**
 * Use it to detect Browser (not SSR/Node) environment.
 *
 * Will return `true` in the Browser.
 * Will return `false` in Node.js.
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

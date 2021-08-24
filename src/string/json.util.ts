/**
 * Attempts to parse object as JSON.
 * Returns original object if JSON parse failed (silently).
 */
export function _jsonParseIfPossible(
  obj: any,
  reviver?: (this: any, key: string, value: any) => any,
): any {
  if (typeof obj === 'string' && obj) {
    try {
      return JSON.parse(obj, reviver)
    } catch {}
  }

  return obj
}

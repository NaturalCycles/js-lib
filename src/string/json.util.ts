/**
 * Attempts to parse object as JSON.
 * Returns original object if JSON parse failed (silently).
 */
export function jsonParseIfPossible(obj: any): any {
  if (typeof obj === 'string' && obj) {
    try {
      return JSON.parse(obj)
    } catch {}
  }

  return obj
}

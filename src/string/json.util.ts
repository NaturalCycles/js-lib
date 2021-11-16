// const possibleJsonStartTokens = ['{', '[', '"']
const DETECT_JSON = /^\s*[{["\-\d]/

/**
 * Attempts to parse object as JSON.
 * Returns original object if JSON parse failed (silently).
 */
export function _jsonParseIfPossible(
  obj: any,
  reviver?: (this: any, key: string, value: any) => any,
): any {
  // Optimization: only try to parse if it looks like JSON: starts with a json possible character
  if (typeof obj === 'string' && obj && DETECT_JSON.test(obj)) {
    try {
      return JSON.parse(obj, reviver)
    } catch {}
  }

  return obj
}

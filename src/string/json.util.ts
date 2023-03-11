import { JsonParseError } from '../error/jsonParseError'
import { Reviver } from '../types'

// const possibleJsonStartTokens = ['{', '[', '"']
const DETECT_JSON = /^\s*[{["\-\d]/

/**
 * Attempts to parse object as JSON.
 * Returns original object if JSON parse failed (silently).
 */
export function _jsonParseIfPossible(obj: any, reviver?: Reviver): any {
  // Optimization: only try to parse if it looks like JSON: starts with a json possible character
  if (typeof obj === 'string' && obj && DETECT_JSON.test(obj)) {
    try {
      return JSON.parse(obj, reviver)
    } catch {}
  }

  return obj
}

/**
 * Same as JSON.parse, but throws JsonParseError:
 *
 * 1. It's message includes a piece of source text (truncated)
 * 2. It's data.text contains full source text
 */
export function _jsonParse(s: string, reviver?: Reviver): unknown {
  try {
    return JSON.parse(s, reviver)
  } catch {
    throw new JsonParseError({
      text: s,
    })
  }
}

import type { StringMap } from '../types'

/**
 * Parses `location.search` string (e.g `?a=1&b=2`) into a StringMap, e.g:
 * `{ a: '1', b: '2' }`
 *
 * Pass `location.search` to it in the Frontend, or any other string on the Backend (where `location.search` is not available).
 *
 * Works both with and without leading `?` character.
 *
 * Yes, there's `URLSearchParams` existing in the Frontend (not in Node yet), but it's API is not
 * as convenient. And the implementation here is super-small.
 *
 * Goal of this function is to produce exactly same output as URLSearchParams would.
 */
export function _parseQueryString(search: string): StringMap {
  const qs: StringMap = {}
  search
    .slice(search.startsWith('?') ? 1 : 0)
    .split('&')
    .forEach(p => {
      const [k, v] = p.split('=')
      if (!k) return
      qs[decodeURIComponent(k)] = decodeURIComponent(v || '')
    })
  return qs
}

/**
 * A wrapper around `new URL(href)`, but it returns `null` instead of throwing an error.
 *
 * For convenience, the params are allowed to be nullable.
 *
 * While `URL.parse` exists, and behaves similarly, it's not widely supported.
 * Null was chosen instead of undefined to make it easier to move to URL.parse if
 * it ever becomes widely supported.
 */
export function _toUrlOrNull(url: string | undefined, base?: string): URL | null {
  if (typeof url !== 'string') return null

  try {
    return new URL(url, base || undefined)
  } catch {
    return null
  }
}

import { StringMap } from '../types'

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
  const qs = {}
  search
    .substr(search[0] === '?' ? 1 : 0)
    .split('&')
    .forEach(p => {
      const [k, v] = p.split('=')
      if (!k) return
      qs[decodeURIComponent(k)] = decodeURIComponent(v || '')
    })
  return qs
}

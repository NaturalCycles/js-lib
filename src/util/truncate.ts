/**
 * _.truncate('hi-diddly-ho there, neighborino')
 * // => 'hi-diddly-ho there, neighbo...'
 */
export function _truncate(s: string, maxLen: number, omission = '...'): string {
  if (!s || s.length <= maxLen) return s

  return s.substr(0, maxLen - omission.length) + omission
}

/**
 * _.truncate('hi-diddly-ho there, neighborino')
 * // => 'hi-diddly-ho there, neighbo...'
 */
export function _truncate(s: string, maxLen: number, omission = '...'): string {
  if (!s || s.length <= maxLen) return s

  return s.substr(0, maxLen - omission.length) + omission
}

/**
 * _.truncateMiddle('abcdefghijklmnopqrstuvwxyz', 10)
 * // => 'abcd...xyz'
 */
export function _truncateMiddle(s: string, maxLen: number, omission = '...'): string {
  if (!s || s.length <= maxLen) return s

  const mark1 = Math.round((maxLen - omission.length) / 2)
  const mark2 = s.length - Math.floor((maxLen - omission.length) / 2)
  return s.substr(0, mark1) + omission + s.substr(mark2)
}

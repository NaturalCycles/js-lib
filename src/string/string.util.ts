/* eslint-disable unicorn/prefer-string-slice */

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 */
export function _capitalize(s: string = ''): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export function _upperFirst(s: string = ''): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function _lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

/**
 * Like String.split(), but with limit, returning the tail together with last element.
 *
 * @return Returns the new array of string segments.
 */
export function _split(str: string, separator: string, limit: number): string[] {
  const parts = str.split(separator)
  return [...parts.slice(0, limit - 1), parts.slice(limit - 1).join(separator)]
}

export function _removeWhitespace(s: string): string {
  return s.replace(/\s/g, '')
}

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

// These functions are modeled after Kotlin's String API

export function _substringBefore(s: string, delimiter: string): string {
  const pos = s.indexOf(delimiter)
  return s.substr(0, pos !== -1 ? pos : undefined)
}

export function _substringBeforeLast(s: string, delimiter: string): string {
  const pos = s.lastIndexOf(delimiter)
  return s.substr(0, pos !== -1 ? pos : undefined)
}

export function _substringAfter(s: string, delimiter: string): string {
  const pos = s.indexOf(delimiter)
  return pos !== -1 ? s.substr(pos + 1) : s
}

export function _substringAfterLast(s: string, delimiter: string): string {
  const pos = s.lastIndexOf(delimiter)
  return pos !== -1 ? s.substr(pos + 1) : s
}

/**
 * Returns the substring between LAST `leftDelimiter` and then FIRST `rightDelimiter`.
 *
 * @example
 *
 * const s = '/Users/lalala/someFile.test.ts'
 * _substringBetweenLast(s, '/', '.')
 * // `someFile`
 */
export function _substringBetweenLast(
  s: string,
  leftDelimiter: string,
  rightDelimiter: string,
): string {
  return _substringBefore(_substringAfterLast(s, leftDelimiter), rightDelimiter)
}

/**
 * Polyfill for es2021 `String.prototype.replaceAll`.
 * Uses regex implementation that's a bit faster than another popular "split/join" implementation.
 *
 * Based on: https://stackoverflow.com/a/1144788/4919972
 */
export function _replaceAll(s: string, find: string, replaceWith: string): string {
  return s.replace(new RegExp(find, 'g'), replaceWith)
}

/**
 * Converts `\n` (aka new-line) to `<br>`, to be presented in HTML.
 * Keeps `\n`, so if it's printed in non-HTML environment it still looks ok-ish.
 */
export function _nl2br(s: string): string {
  return s.replace(/\n/g, '<br>\n')
}

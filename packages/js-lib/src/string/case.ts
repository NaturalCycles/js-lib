import { words } from './lodash/words.js'
import { _upperFirst } from './string.util.js'

export function _camelCase(s: string): string {
  let r = ''
  for (let word of words(s.replaceAll(/['\u2019]/g, ''))) {
    word = word.toLowerCase()
    r += r ? _upperFirst(word) : word
  }
  return r
}

export function _snakeCase(s: string): string {
  let r = ''
  for (const word of words(s.replaceAll(/['\u2019]/g, ''))) {
    r += (r ? '_' : '') + word.toLowerCase()
  }
  return r
}

export function _kebabCase(s: string): string {
  let r = ''
  for (const word of words(s.replaceAll(/['\u2019]/g, ''))) {
    r += (r ? '-' : '') + word.toLowerCase()
  }
  return r
}

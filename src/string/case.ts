import { words } from './lodash/words'
import { _upperFirst } from './string.util'

export function _camelCase(s: string): string {
  // return s.replace(/(_\w)/g, m => m[1]!.toUpperCase())
  return words(s.replace(/['\u2019]/g, '')).reduce((result, word, index) => {
    word = word.toLowerCase()
    return result + (index ? _upperFirst(word) : word)
  }, '')
}

export function _snakeCase(s: string): string {
  return words(s.replace(/['\u2019]/g, '')).reduce(
    (result, word, index) => result + (index ? '_' : '') + word.toLowerCase(),
    '',
  )
}

export function _kebabCase(s: string): string {
  return words(s.replace(/['\u2019]/g, '')).reduce(
    (result, word, index) => result + (index ? '-' : '') + word.toLowerCase(),
    '',
  )
}

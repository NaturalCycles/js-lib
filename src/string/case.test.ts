import { expectResults } from '@naturalcycles/dev-lib/dist/testing'
import { _camelCase, _kebabCase, _snakeCase } from './case'

const words = [
  'Add data',
  'directorOfTrackAndTrigger',
  'directorOfOptiPush',
  'a',
  'aa',
  'aA',
  'Aa',
  'Lo Lo Lo  Lo',
  'Consent_marketing',
  'Consent_MARKETING',
  'LH test',
  'foo2bar',
  '__FOO_BAR__',
  '--FOO-BAR--',
]

test('_snakeCase', () => {
  expectResults(_snakeCase, words).toMatchSnapshot()
})

test('_camelCase', () => {
  const allWords = [...words, ...words.map(_snakeCase)]
  expectResults(s => _camelCase(s), allWords).toMatchSnapshot()
})

test('_kebabCase', () => {
  expectResults(_kebabCase, words).toMatchSnapshot()
})

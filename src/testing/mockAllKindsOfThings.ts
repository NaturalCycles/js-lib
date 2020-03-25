import { AppError } from '@naturalcycles/js-lib'

export const mockAllKindsOfThings = () => [
  undefined,
  null,
  true,
  false,
  NaN,
  Infinity,
  '',
  ' ',
  'ho ho ho',
  '{',
  '{"a": "a1"}',
  '[5, null, "s"]',
  [5, null, 's'],
  15,
  [1, 2, 3],
  {
    a: 'a1',
    b: 'b1',
    c: {
      d: 25,
      e: undefined,
    },
  },
  {
    message: 'Reference already exists',
    documentation_url: 'https://developer.github.com/v3/git/refs/#create-a-reference',
  },
  function abc() {
    console.log('inside abc')
  },
  /i am regex, who are you?/,
  new Map([['a', 'b']]),
  new Set(['a', 'b', 'c']),
  new Error('some err msg'),
  new AppError('app error', {
    k1: 'v1',
  }),
  Symbol('a_am_symbol'),
  new Date(1984, 5, 21),
]

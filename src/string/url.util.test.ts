import { _parseQueryString } from './url.util'

test.each([
  ['', {}],
  ['?a', { a: '' }],
  ['a', { a: '' }],
  ['a=', { a: '' }],
  ['a&b', { a: '', b: '' }],
  ['a&b=', { a: '', b: '' }],
  ['a=1&b=', { a: '1', b: '' }],
  ['a=1&b=&c', { a: '1', b: '', c: '' }],
  [
    '?url=http%3A%2F%2Fgoogle.com%2F%3Fyo%3Dvalue%20with%20space&other=too',
    {
      url: 'http://google.com/?yo=value with space',
      other: 'too',
    },
  ],
])('_parseQueryString %s to equal %s', (search, result) => {
  expect(_parseQueryString(search)).toEqual(result)
})

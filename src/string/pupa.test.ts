import type { PupaOptions } from './pupa'
import { pupa } from './pupa'

test('main', () => {
  // Normal placeholder
  expect(pupa('{foo}', { foo: '!' })).toBe('!')
  expect(pupa('{foo}', { foo: 10 })).toBe('10')
  expect(pupa('{foo}', { foo: 0 })).toBe('0')
  expect(pupa('{fo-o}', { 'fo-o': 0 })).toBe('0')
  expect(pupa('{foo}{foo}', { foo: '!' })).toBe('!!')
  expect(pupa('{foo}{bar}{foo}', { foo: '!', bar: '#' })).toBe('!#!')
  expect(pupa('yo {foo} lol {bar} sup', { foo: '🦄', bar: '🌈' })).toBe('yo 🦄 lol 🌈 sup')

  expect(
    pupa('{foo}{deeply.nested.valueFoo}', {
      foo: '!',
      deeply: {
        nested: {
          valueFoo: '#',
        },
      },
    }),
  ).toBe('!#')

  expect(pupa('{0}{1}', ['!', '#'])).toBe('!#')

  // Encoding HTML Entities to avoid code injection
  expect(pupa('{{foo}}', { foo: '!' })).toBe('!')
  expect(pupa('{{foo}}', { foo: 10 })).toBe('10')
  expect(pupa('{{foo}}', { foo: 0 })).toBe('0')
  expect(pupa('{{foo}}{{foo}}', { foo: '!' })).toBe('!!')
  expect(pupa('{foo}{{bar}}{foo}', { foo: '!', bar: '#' })).toBe('!#!')
  expect(pupa('yo {{foo}} lol {{bar}} sup', { foo: '🦄', bar: '🌈' })).toBe('yo 🦄 lol 🌈 sup')

  expect(
    pupa('{foo}{{deeply.nested.valueFoo}}', {
      foo: '!',
      deeply: {
        nested: {
          valueFoo: '<br>#</br>',
        },
      },
    }),
  ).toBe('!&lt;br&gt;#&lt;/br&gt;')

  expect(pupa('{{0}}{{1}}', ['!', '#'])).toBe('!#')

  expect(pupa('{{0}}{{1}}', ['<br>yo</br>', '<i>lol</i>'])).toBe(
    '&lt;br&gt;yo&lt;/br&gt;&lt;i&gt;lol&lt;/i&gt;',
  )
})

test('do not match non-identifiers', () => {
  const fixture = '"*.{json,md,css,graphql,html}"'
  expect(pupa(fixture, [])).toBe(fixture)
})

test('ignore missing', () => {
  const template = 'foo{{bar}}{undefined}'
  const options = { ignoreMissing: true }
  expect(pupa(template, {}, options)).toBe(template)
})

test('throw on undefined by default', () => {
  expect(() => {
    pupa('{foo}', {})
  }).toThrowErrorMatchingInlineSnapshot(`"Missing a value for the placeholder: foo"`)
})

test('transform and ignore missing', () => {
  const options: PupaOptions = {
    ignoreMissing: true,
    transform: ({ value }) => (Number.isNaN(Number.parseInt(value, 10)) ? undefined : value),
  }
  expect(pupa('{0} {1} {2}', ['0', 42, 3.14], options)).toBe('0 42 3.14')
  expect(pupa('{0} {1} {2}', ['0', null, 3.14], options)).toBe('0 {1} 3.14')
})

test('transform and throw on undefined', () => {
  const options: PupaOptions = {
    transform: ({ value }) => (Number.isNaN(Number.parseInt(value, 10)) ? undefined : value),
  }

  expect(() => {
    pupa('{0} {1} {2}', ['0', 42, 3.14], options)
  }).not.toThrow()

  expect(() => {
    pupa('{0} {1} {2}', ['0', null, 3.14], options)
  }).toThrowErrorMatchingInlineSnapshot(`"Missing a value for the placeholder: 1"`)
})

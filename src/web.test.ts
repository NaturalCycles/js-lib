import { InMemoryWebStorage } from './web'

test('InMemoryWebStorage', () => {
  expect(() => localStorage.getItem('a')).toThrowErrorMatchingInlineSnapshot(
    `"localStorage is not defined"`,
  )

  // this is how it can be mocked/polyfilled in SSR environment (like here - we're running in Node)
  globalThis.localStorage ||= new InMemoryWebStorage()

  expect(localStorage.getItem('a')).toBeNull()
  expect(localStorage.length).toBe(0)
  localStorage.setItem('a', 'aa')
  expect(localStorage.getItem('a')).toBe('aa')
  expect(localStorage.length).toBe(1)
  localStorage.clear()
  expect(localStorage.length).toBe(0)
  expect(localStorage.getItem('a')).toBeNull()
  expect(localStorage.getItem('b')).toBeNull()

  // should stringify
  localStorage.setItem('a', 1 as any)
  expect(localStorage.getItem('a')).toBe('1')
})

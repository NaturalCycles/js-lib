import { deepFreeze, silentConsole, silentConsoleIfRunAll } from './test.shared.util'

test('deepFreeze', () => {
  const o = {
    a: {
      b: 'bb',
    },
  }
  deepFreeze(o)
  expect(() => (o.a = 'cc' as any)).toThrow()
  expect(() => (o.a.b = 'cc')).toThrow()
})

test('silentConsole', () => {
  silentConsole()
  silentConsoleIfRunAll()
})

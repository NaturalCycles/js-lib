import { deepFreeze, runAllTests, silentConsole, silentConsoleIfRunAll } from './test.shared.util'

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
  console.log()
  console.debug()
  console.info()
  console.warn()
  console.error()
})

test('runAllTests', () => {
  runAllTests()

  process.argv = []
  expect(runAllTests()).toBe(false)
})

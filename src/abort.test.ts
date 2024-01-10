import { createAbortableSignal } from './abort'

test('abortableSignal', () => {
  class A {
    constructor(public signal: AbortSignal) {}
  }

  const as = createAbortableSignal()

  const a = new A(as)
  expect(a.signal.aborted).toBe(false)

  as.abort()
  expect(a.signal.aborted).toBe(true)
})

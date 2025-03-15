import { expect, test, vi } from 'vitest'
import { _range } from '../array/range'
import { pDelay } from '../promise/pDelay'
import { _getMemo, _Memo } from './memo.decorator'

class A {
  func(n: number): void {
    console.log(`func ${n}`)
  }

  @_Memo()
  a(a1: number, a2: number): number {
    const n = a1 * a2
    this.func(n)
    return n
  }
}

test('memo a', () => {
  const a = new A()
  vi.spyOn(a, 'func').mockImplementation(() => {})

  // first call
  let r = a.a(2, 3)
  expect(r).toBe(6)
  r = a.a(3, 4)
  expect(r).toBe(12)

  // second call
  r = a.a(2, 3)
  expect(r).toBe(6)
  r = a.a(3, 4)
  expect(r).toBe(12)

  // to be called once per set of arguments (2)
  expect(a.func).toMatchSnapshot()

  expect(_getMemo(a.a).getInstanceCache().size).toBe(1)

  // cleanup for the next tests
  _getMemo(a.a).clear()

  expect(_getMemo(a.a).getInstanceCache().size).toBe(0)
})

test('MEMO_DROP_CACHE', () => {
  const a = new A()
  vi.spyOn(a, 'func').mockImplementation(() => {})

  // first call
  a.a(2, 3)

  _getMemo(a.a).clear()

  // second call
  a.a(2, 3)

  expect(a.func).toHaveBeenCalledTimes(2)
})

test('memo unsupported', () => {
  const pd = { value: 'property' } as PropertyDescriptor
  expect(() => _Memo()(null as any, 'a', pd)).toThrow()
})

class B {
  cacheMisses = 0

  @_Memo()
  a(a1 = 'def'): void {
    console.log(`a called with a1=${a1}`)
    this.cacheMisses++
  }
}

test('should work with default arg values', () => {
  const b = new B()

  // Call 1 with default (cache miss). arg1=undefined
  b.a()

  // Call 2 with default (cache hit). arg1=undefined
  b.a()

  // Call 3 with same as default (cache miss). arg1=def
  b.a('def')

  // Call 4 with non-default (cache miss). arg1=nondef
  b.a('nondef')

  expect(b.cacheMisses).toBe(3)
})

class C {
  calls = 0

  @_Memo()
  async fn(): Promise<void> {
    this.calls++
    await pDelay(100)
  }
}

test('swarm test of async function', async () => {
  // Swarm is when one "slow" async function is called multiple times in parallel
  // Expectation is that it should return the same Promise and `calls` should equal to 1
  // Because it **synchronously** returns a Promise (despite the fact that it's async)
  const c = new C()

  await Promise.all(_range(10).map(() => c.fn()))

  expect(c.calls).toBe(1)
})

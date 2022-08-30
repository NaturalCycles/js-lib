import { _AsyncMemo } from './asyncMemo.decorator'
import { MapMemoCache } from './memo.util'

class A {
  func(n: number): void {
    console.log(`func ${n}`)
  }

  @_AsyncMemo()
  async a(a1: number, a2: number): Promise<number> {
    const n = a1 * a2
    this.func(n)
    return n
  }
}

test('memo a', async () => {
  const a = new A()
  jest.spyOn(a, 'func').mockImplementation()

  // first call
  let r = await a.a(2, 3)
  expect(r).toBe(6)
  r = await a.a(3, 4)
  expect(r).toBe(12)

  // second call
  r = await a.a(2, 3)
  expect(r).toBe(6)
  r = await a.a(3, 4)
  expect(r).toBe(12)

  // to be called once per set of arguments (2)
  expect(a.func).toMatchSnapshot()

  // cleanup for the next tests
  await (a.a as any).dropCache()
})

test('MEMO_DROP_CACHE', async () => {
  const a = new A()
  jest.spyOn(a, 'func').mockImplementation()

  // first call
  await a.a(2, 3)

  // drop cache
  await (a.a as any).dropCache()

  // second call
  await a.a(2, 3)

  expect(a.func).toBeCalledTimes(2)
})

class B {
  cacheMisses = 0

  @_AsyncMemo() // testing 2 layers of AsyncMemo!
  @_AsyncMemo({
    // testing to provide specific cacheFactory, should be no difference in this test
    cacheFactory: () => new MapMemoCache(),
  })
  async a(a1 = 'def'): Promise<number> {
    console.log(`a called with a1=${a1}`)
    this.cacheMisses++
    return 1 // it cannot return undefined, otherwise it'll always MISS
  }
}

test('should work with default arg values', async () => {
  const b = new B()

  // Call 1 with default (cache miss). arg1=undefined
  await b.a()

  // Call 2 with default (cache hit). arg1=undefined
  await b.a()

  // Call 3 with same as default (cache miss). arg1=def
  await b.a('def')

  // Call 4 with non-default (cache miss). arg1=nondef
  await b.a('nondef')

  expect(b.cacheMisses).toBe(3)
})

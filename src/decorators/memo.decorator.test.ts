import { memo } from './memo.decorator'

class A {
  func (n: number): void {
    console.log(`func ${n}`)
  }

  @memo()
  a (a1: number, a2: number): number {
    const n = a1 * a2
    this.func(n)
    return n
  }
}

beforeEach(() => {
  jest.restoreAllMocks()
})

test('memo a', () => {
  const a = new A()
  a.func = jest.fn()

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

  // cleanup for the next tests
  ;(a.a as any).dropCache()
})

test('MEMO_DROP_CACHE', () => {
  const a = new A()
  a.func = jest.fn()

  // first call
  a.a(2, 3)

  // drop cache
  ;(a.a as any).dropCache()

  // second call
  a.a(2, 3)

  expect(a.func).toBeCalledTimes(2)
})

test('memo unsupported', () => {
  const pd = { value: 'property' } as PropertyDescriptor
  expect(() => memo()(null, 'a', pd)).toThrow()
})

class B {
  cacheMisses = 0

  @memo()
  a (a1 = 'def') {
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

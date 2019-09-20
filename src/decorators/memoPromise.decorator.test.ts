import { memo } from './memo.decorator'

class A {
  counter = 0

  func(n: number): void {
    console.log(`func ${n}`)
  }

  @memo()
  async a(a1: number, a2: number): Promise<number> {
    const n = a1 * a2
    this.func(n)
    return n
  }

  /**
   * Rejects 1 and 2nd time, resolved then
   * @param a1
   * @param a2
   */
  @memo({ noCacheRejected: true })
  async b(a1: number, a2: number): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100))
    this.counter++

    if (this.counter < 3) throw new Error(`error_${this.counter}`)

    const n = a1 * a2
    this.func(n)
    return n
  }
}

beforeEach(() => {
  jest.restoreAllMocks()
})

test('memo a', async () => {
  const a = new A()
  a.func = jest.fn()

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
  ;(a.a as any).dropCache()
})

test('MEMO_DROP_CACHE', async () => {
  const a = new A()
  a.func = jest.fn()

  // first call
  await a.a(2, 3)

  // drop cache
  ;(a.a as any).dropCache()

  // second call
  await a.a(2, 3)

  expect(a.func).toBeCalledTimes(2)
})

test('memo b', async () => {
  // Should reject first 2 times, resolve next, cache next

  const a = new A()
  a.func = jest.fn()

  // first call
  await expect(a.b(2, 3)).rejects.toThrowError('error_1')
  // second call
  await expect(a.b(2, 3)).rejects.toThrowError('error_2')

  // third call - should resolve
  expect(await a.b(2, 3)).toBe(6)

  // 4th call - should return cached
  expect(await a.b(2, 3)).toBe(6)

  expect(a.func).toHaveBeenCalledTimes(1)

  // cleanup for the next tests
  ;(a.b as any).dropCache()
})

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
})

test('memo unsupported', () => {
  const pd = { value: 'property' } as PropertyDescriptor
  expect(() => memo()(null, 'a', pd)).toThrow()
})

import { _Retry } from './retry.decorator'

class C {
  constructor(public succeedOnAttempt: number) {}

  attempt = 0

  @_Retry({
    maxAttempts: 3,
    delay: 100,
    delayMultiplier: 1,
    logAll: true,
  })
  async fn(...args: any[]) {
    this.attempt++
    // console.log(`fn called attempt=${attempt}`, {args})
    if (this.attempt >= this.succeedOnAttempt) {
      return args
    }

    throw new Error(`fail`)
  }
}

test('@Retry', async () => {
  const inst = new C(3)
  const r = await inst.fn(1, 2, 3)
  // console.log(r)
  expect(r).toEqual([1, 2, 3])
})

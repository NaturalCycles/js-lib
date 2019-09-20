import { _tryCatch, TryCatch } from './tryCatch'

const _fnSuccess = (...args: any[]) => args

const _fnError = () => {
  throw new Error('fail')
}

test('_tryCatch', async () => {
  const fnSuccess = _tryCatch(_fnSuccess)
  let r = await fnSuccess(1, 2, 3)
  expect(r).toEqual([1, 2, 3])

  const fnError = _tryCatch(_fnError, {
    onError: err => {
      console.log('onError fired with: ', err.message)
    },
    logSuccess: true,
    logError: true,
  })

  r = await fnError()
  expect(r).toBeUndefined()
})

class C {
  @TryCatch()
  fnSuccess(...args: any[]) {
    return args
  }

  @TryCatch({
    onError: err => {
      console.log('onError fired with: ', err.message)
    },
    logSuccess: true,
    logError: true,
  })
  fnError() {
    throw new Error('fail')
  }
}
const c = new C()

test('@TryCatch', async () => {
  const r = await c.fnSuccess(1, 2, 3)
  expect(r).toEqual([1, 2, 3])

  const r2 = await c.fnError()
  expect(r2).toBeUndefined()
})

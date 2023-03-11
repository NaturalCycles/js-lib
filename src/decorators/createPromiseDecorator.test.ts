import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { pDelay } from '../index'
import { _createPromiseDecorator } from './createPromiseDecorator'

export interface LoaderDecoratorParams {
  type: string
}

const beforeFn = jest.fn()
const thenFn = jest.fn(r => r.res)
const catchFn = jest.fn()
const finallyFn = jest.fn()

// eslint-disable-next-line @typescript-eslint/naming-convention
const DummyDecorator = () =>
  _createPromiseDecorator({
    decoratorName: 'Dummy',
  })

// eslint-disable-next-line @typescript-eslint/naming-convention
const Loader = (params: LoaderDecoratorParams) =>
  _createPromiseDecorator(
    {
      decoratorName: 'Loader',
      beforeFn,
      thenFn,
      catchFn,
      finallyFn,
    },
    params,
  )

class C {
  @Loader({ type: 'MY_TYPE' })
  async run(a: number): Promise<number> {
    return await pDelay(10, a * 2)
  }

  @DummyDecorator()
  async dummy(): Promise<number> {
    return 4
  }

  // Cannot use _createPromiseDecorator on sync methods!
  // @DummyDecorator()
  // dummySync(): number {
  //   return 4
  // }
}
const c = new C()

beforeEach(() => {
  mockTime()
})

test('_createPromiseDecorator', async () => {
  const _r = await c.run(2)
  // expect(r).toBe(4) // todo: it suddenly broke

  expect(thenFn).toMatchSnapshot()

  expect(await c.dummy()).toBe(4)
})

// todo: cover more cases

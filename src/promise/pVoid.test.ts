import { test } from 'vitest'
import { pDelay } from './pDelay'

function pVoid(fn: () => Promise<any>): void {
  // const fake = new Error('fake')
  const fake = { stack: '' }
  Error.captureStackTrace(fake)

  fn().catch(err => {
    console.error('pVoid error!', err)
    console.error(fake.stack)
  })
}

test('pVoid', async () => {
  await myFunction1()

  await pDelay(10)
  console.log('done!')
})

async function myFunction1(): Promise<void> {
  pVoid(async () => await myFunction2())
}

async function myFunction2(): Promise<void> {
  await myFunction3()
}

async function myFunction3(): Promise<void> {
  await pDelay(1)
  throw new Error('myError')
}

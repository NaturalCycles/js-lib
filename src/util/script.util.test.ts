/**
 * env should be jsdom, but it currently leaks memory
 */
import { loadScript } from './script.util'

test('loadScript', async () => {
  // mock the world
  const el: any = {}
  ;(global as any).document = {
    head: {},
  }
  document.createElement = jest.fn(() => el)
  ;(document.head!.appendChild as any) = () => {}

  let promise = loadScript('http://some.script')
  el.onload()
  await promise
  promise = loadScript('http://some.script', false)
  el.onload()
  await promise
})

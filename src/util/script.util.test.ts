/**
 * @jest-environment jsdom
 */
import { loadScript } from './script.util'

test('loadScript', async () => {
  // mock the world
  const el: any = {}
  document.createElement = jest.fn(() => el)
  ;(document.head!.appendChild as any) = () => {}

  let promise = loadScript('http://some.script')
  el.onload()
  await promise
  promise = loadScript('http://some.script', false)
  el.onload()
  await promise
})

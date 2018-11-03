/**
 * @jest-environment jsdom
 */

import { scriptSharedUtil } from './script.shared.util'

test('loadScript', async () => {
  // mock the world
  const el: any = {}
  document.createElement = jest.fn(() => el)
  ;(document.head!.appendChild as any) = () => {}

  let promise = scriptSharedUtil.loadScript('http://some.script')
  el.onload()
  await promise
  promise = scriptSharedUtil.loadScript('http://some.script', false)
  el.onload()
  await promise
})

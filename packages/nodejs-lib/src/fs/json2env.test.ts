import { expect, test } from 'vitest'
import { objectToGithubActionsEnv, objectToShellExport } from './json2env.js'

test('objectToGithubActionsEnv', () => {
  expect(objectToGithubActionsEnv({})).toBe('')

  expect(
    objectToGithubActionsEnv({
      a: 'a',
      minInstances: 0,
      maxInstances: 8,
      c: false,
      d: true,
    }),
  ).toMatchInlineSnapshot(`
"a=a
minInstances=0
maxInstances=8
c=false
d=true
"
`)

  expect(
    objectToShellExport({
      a: 'a',
      minInstances: 0,
      maxInstances: 8,
      c: false,
      d: true,
    }),
  ).toMatchInlineSnapshot(`
"export a="a"
export minInstances="0"
export maxInstances="8"
export c="false"
export d="true"
"
`)
})

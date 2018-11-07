import { srcDir } from '../cnst/paths.cnts'
import { execCommand } from './exec.util'
import { runPrettier } from './prettier.util'

// const asMock = <T>(a: T): jest.Mock<T> => a as any

test('runPrettier, shared config', async () => {
  const _execCommand = ((execCommand as any) = jest.fn())
  // mock cwd, so config is not found
  process.cwd = jest.fn(() => __dirname)
  await runPrettier()
  // expect(_execCommand).toHaveBeenCalled()
  const cmd = _execCommand.mock.calls[0][0]
  // console.log(cmd)
  expect(cmd).toMatch('prettier')
  expect(cmd).toMatch('shared-module/cfg/prettier.config.js')
})

test('runPrettier, local config', async () => {
  const _execCommand = ((execCommand as any) = jest.fn())
  // mock cwd, so config is found
  process.cwd = jest.fn(() => `${srcDir}/test/integration/prettier`)

  await runPrettier()
  const cmd = _execCommand.mock.calls[0][0]
  console.log(cmd)
  expect(cmd).toMatch('prettier')
  expect(cmd).toMatch('test/integration/prettier/prettier.config.js')
})

import { execCommand } from './exec.util'
import { runPrettier } from './prettier.util'

// const asMock = <T>(a: T): jest.Mock<T> => a as any

test('runPrettier', async () => {
  const _execCommand = ((execCommand as any) = jest.fn())
  await runPrettier()
  // expect(_execCommand).toHaveBeenCalled()
  const cmd = _execCommand.mock.calls[0][0]
  // console.log(cmd)
  expect(cmd).toMatch('prettier')
  expect(cmd).not.toMatch('--config')
})

test('runPrettier, no config', async () => {
  const _execCommand = ((execCommand as any) = jest.fn())
  // mock cwd, so config is not found
  process.cwd = jest.fn(() => __dirname)

  await runPrettier()
  const cmd = _execCommand.mock.calls[0][0]
  // console.log(cmd)
  expect(cmd).toMatch('prettier')
  expect(cmd).toMatch('--config')
})

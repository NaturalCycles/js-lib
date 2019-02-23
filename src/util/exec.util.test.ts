import { execCommand } from './exec.util'

test('execCommand ok', async () => {
  const r = await execCommand('ls > /dev/null')
  expect(r).toBe(0)
})

test('execCommand error, exit', async () => {
  process.exit = jest.fn() as any
  await expect(execCommand('abcd')).rejects.toThrow()
  expect(process.exit).toMatchSnapshot()
})

test('execCommand error, reject', async () => {
  await expect(execCommand('abcd', false)).rejects.toThrow()
})

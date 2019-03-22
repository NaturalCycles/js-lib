import { execCommand } from './exec.util'

test('execCommand ok', async () => {
  await execCommand('ls > /dev/null', [], {
    shell: true,
  })
})

test('execCommand error, exit', async () => {
  const processExit = jest.spyOn(process, 'exit').mockImplementation()
  await expect(execCommand('abcd')).rejects.toThrow()
  expect(processExit).toMatchSnapshot()
})

test('execCommand error, reject', async () => {
  await expect(execCommand('abcd', [])).rejects.toThrow()
})

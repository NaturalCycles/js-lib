test('empty', () => {})

/*
test('execCommand ok', async () => {
  await execCommand('ls > /dev/null', [], {
    shell: true,
  })
})


test('execCommand error, exit', async () => {
  const processExit = jest.spyOn(process, 'exit').mockImplementation(() => ({}) as never)
  await expect(execCommand('abcd')).rejects.toThrow()
  expect(processExit).toMatchSnapshot()
})

test('execCommand error, reject', async () => {
  await expect(execCommand('abcd', [])).rejects.toThrow()
})
*/

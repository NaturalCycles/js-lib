import { runJest } from '../util/jest.util'

export async function testCommand (): Promise<void> {
  await runJest()
}

import { runJest } from '../util/jest.util'

export async function testCICommand (): Promise<void> {
  await runJest(true)
}

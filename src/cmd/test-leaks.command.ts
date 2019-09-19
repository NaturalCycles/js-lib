import { runJest } from '../util/jest.util'

export async function testLeaksCommand(): Promise<void> {
  await runJest({ leaks: true })
}

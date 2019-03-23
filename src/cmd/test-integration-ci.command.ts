import { runJest } from '../util/jest.util'

export async function testIntegrationCiCommand (): Promise<void> {
  await runJest(true, true)
}

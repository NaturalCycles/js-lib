import { runJest } from '../util/jest.util'

export async function testIntegrationCommand(): Promise<void> {
  await runJest({ integration: true })
}

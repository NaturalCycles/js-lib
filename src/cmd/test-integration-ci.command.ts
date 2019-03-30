import { runJest } from '../util/jest.util'

export async function testIntegrationCiCommand (): Promise<void> {
  await runJest({ integration: true, ci: true })
}

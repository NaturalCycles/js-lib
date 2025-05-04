import type { ViteUserConfig } from 'vitest/config'
import type { InlineConfig } from 'vitest/node'

/**

 Usage example:

 export default defineVitestConfig({
   // overrides here, e.g:
   // bail: 1,
 })

 */
export function defineVitestConfig(config?: Partial<ViteUserConfig>): ViteUserConfig

export const sharedConfig: InlineConfig

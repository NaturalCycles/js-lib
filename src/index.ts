import { buildProdCommand } from './cmd/build-prod.command'
import type { BuildInfo } from './util/buildInfo.model'
import { generateBuildInfo } from './util/buildInfo.util'

export { generateBuildInfo, buildProdCommand }
export type { BuildInfo }

export * from './util/git.util'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TZ?: string
      APP_ENV?: string
      JEST_NO_ALPHABETIC?: string
    }
  }
}

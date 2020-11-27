import { buildProdCommand } from './cmd/build-prod.command'
import type { BuildInfo } from './util/buildInfo.model'
import { generateBuildInfo } from './util/buildInfo.util'

export { generateBuildInfo, buildProdCommand }
export type { BuildInfo }

export * from './util/git.util'

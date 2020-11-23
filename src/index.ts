import { buildProdCommand } from './cmd/build-prod.command'
import { BuildInfo } from './util/buildInfo.model'
import { generateBuildInfo } from './util/buildInfo.util'

export { BuildInfo, generateBuildInfo, buildProdCommand }

export * from './util/git.util'

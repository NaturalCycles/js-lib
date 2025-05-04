import { _filterNullishValues, localTime } from '@naturalcycles/js-lib'
import { memoryUsageFull, processSharedUtil } from '@naturalcycles/nodejs-lib'
import { getDeployInfo } from './deployInfo.util.js'
import type { BackendRequestHandler } from './server.model.js'

const { versions, arch, platform } = process
const { GAE_APPLICATION, GAE_SERVICE, GAE_VERSION, K_SERVICE, K_REVISION, APP_ENV, NODE_OPTIONS } =
  process.env

export function serverStatusMiddleware(projectDir?: string, extra?: any): BackendRequestHandler {
  return async (_req, res) => {
    res.json(getServerStatusData(projectDir, extra))
  }
}

export function getServerStatusData(
  projectDir: string = process.cwd(),
  extra?: any,
): Record<string, any> {
  const { gitRev, gitBranch, ts } = getDeployInfo(projectDir)
  const t = localTime(ts)
  const deployBuildTime = t.toPretty()
  const buildInfo = [t.toStringCompact(), gitBranch, gitRev].filter(Boolean).join('_')

  return _filterNullishValues({
    started: getStartedStr(),
    deployBuildTime,
    APP_ENV,
    buildInfo,
    GAE_APPLICATION,
    GAE_SERVICE,
    GAE_VERSION,
    K_SERVICE,
    K_REVISION,
    processInfo: {
      arch,
      platform,
    },
    mem: memoryUsageFull(),
    cpuAvg: processSharedUtil.cpuAvg(),
    cpuInfo: processSharedUtil.cpuInfo(),
    versions,
    NODE_OPTIONS,
    ...extra,
  })
}

function getStartedStr(): string {
  const started = localTime.now().minus(process.uptime(), 'second')
  return `${started.toPretty()} (${started.toFromNowString()})`
}

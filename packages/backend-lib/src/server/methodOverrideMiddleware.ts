import type { BackendRequestHandler } from './server.model.js'

export interface MethodOverrideMiddlewareCfg {
  /**
   * @default _method
   */
  methodKey?: string
}

export function methodOverrideMiddleware(
  cfg: MethodOverrideMiddlewareCfg = {},
): BackendRequestHandler {
  const { methodKey } = {
    methodKey: '_method',
    ...cfg,
  }

  return (req, _res, next) => {
    if (req.query[methodKey]) {
      req.method = req.query[methodKey] as string
      // delete req.query[methodKey]
    }

    next()
  }
}

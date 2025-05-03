import type { BackendRequest } from './server.model.js'

/**
 * Returns e.g:
 *
 * GET /some/endpoint
 *
 * Gets the correct full path when used from sub-router-resources.
 * Strips away the queryString.
 */
export function getRequestEndpoint(req: BackendRequest): string {
  let path = (req.baseUrl + (req.route?.path || req.path)).toLowerCase()
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, path.length - 1)
  }

  return [req.method, path].join(' ')
}

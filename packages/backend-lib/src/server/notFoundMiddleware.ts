import { getRequestEndpoint } from './request.util.js'
import type { BackendRequestHandler } from './server.model.js'

export function notFoundMiddleware(): BackendRequestHandler {
  return (req, res) => {
    res.status(404).send(`404 Not Found: ${getRequestEndpoint(req)}`)
  }
}

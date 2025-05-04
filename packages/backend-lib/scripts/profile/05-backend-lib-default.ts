import http from 'node:http'
import { createDefaultApp, getDefaultRouter } from '../../src/index.js'

export async function createServerBackendLib(): Promise<http.Server> {
  const router = getDefaultRouter()
  // const router = Router()

  const helloResource = router
  router.get('/', (_req, res) => {
    res.json({ hello: 'world' })
  })

  // Testing the effect of logging
  // router.get('/', (req, res) => {
  //   const _log = getRequestLogger()
  //   // log('hello log')
  //   res.json({ hello: 'world' })
  // })

  const app = await createDefaultApp({
    resources: [helloResource],
  })

  return http.createServer(app)
}

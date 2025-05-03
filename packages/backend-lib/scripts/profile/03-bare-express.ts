import http from 'node:http'
import express from 'express'

export async function createServerBareExpress(): Promise<http.Server> {
  const app = express()
  app.disable('etag')
  app.disable('x-powered-by')
  app.get('/', (_req, res) => {
    res.json({ hello: 'world' })
  })
  return http.createServer(app)
}

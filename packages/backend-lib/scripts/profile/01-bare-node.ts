import http from 'node:http'

export async function createServerBareNode(): Promise<http.Server> {
  return http.createServer((_req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ hello: 'world' }))
  })
}

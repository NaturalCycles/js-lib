import type { Server } from 'node:http'
import os from 'node:os'
import { _Memo, _ms } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey, white } from '@naturalcycles/nodejs-lib'
import { createDefaultApp } from '../index.js'
import type { StartServerCfg, StartServerData } from './startServer.model.js'

const { NODE_OPTIONS, APP_ENV } = process.env

export class BackendServer {
  constructor(private cfg: StartServerCfg) {}

  server?: Server

  async start(): Promise<StartServerData> {
    const { port: cfgPort, registerUncaughtExceptionHandlers = true } = this.cfg
    const expressApp = this.cfg.expressApp || (await createDefaultApp(this.cfg))

    // 1. Register error handlers, etc.
    if (registerUncaughtExceptionHandlers) {
      process.on('uncaughtException', err => {
        console.error('BackendServer uncaughtException:', err)
        this.cfg.sentryService?.captureException(err, false)
      })

      process.on('unhandledRejection', err => {
        console.error('BackendServer unhandledRejection:', err)
        this.cfg.sentryService?.captureException(err, false)
      })
    }

    process.once('SIGINT', () => this.stop('SIGINT'))
    process.once('SIGTERM', () => this.stop('SIGTERM'))

    // sentryService.install()

    // 2. Start Express Server
    const port = Number(process.env['PORT']) || cfgPort || 8080

    this.server = await new Promise<Server>((resolve, reject) => {
      const server = expressApp.listen(port, (err?: Error) => {
        if (err) return reject(err)
        resolve(server)
      })
    })

    // This is to fix GCP LoadBalancer race condition
    this.server.keepAliveTimeout = 600 * 1000 // 10 minutes

    let address = `http://localhost:${port}` // default

    const addr = this.server.address()
    if (addr) {
      if (typeof addr === 'string') {
        address = addr
      } else if (addr.address !== '::') {
        address = `http://${addr.address}:${port}`
      }
    }

    const cpus = os.cpus().length
    const availableParallelism = os.availableParallelism?.()
    const { version, platform, arch } = process
    console.log(
      dimGrey(
        `node ${version} ${platform} ${arch}, NODE_OPTIONS: ${NODE_OPTIONS || 'undefined'}, APP_ENV: ${
          APP_ENV || 'undefined'
        }, cpus: ${cpus}, availableParallelism: ${availableParallelism}`,
      ),
    )
    console.log(`serverStarted on ${white(address)} in ${dimGrey(_ms(process.uptime() * 1000))}`)

    return {
      port,
      server: this.server,
      address,
    }
  }

  /**
   * Gracefully shuts down the server.
   * Does `process.exit()` in the end.
   */
  @_Memo()
  async stop(reason: string): Promise<void> {
    console.log(dimGrey(`Server shutdown (${reason})...`))

    const shutdownTimeout = setTimeout(() => {
      console.log(boldGrey('Forceful shutdown after timeout'))
      process.exit(0)
    }, this.cfg.forceShutdownTimeout ?? 10_000)

    try {
      await Promise.all([
        this.server && new Promise(r => this.server!.close(r)),
        this.cfg.onShutdown?.(),
      ])

      clearTimeout(shutdownTimeout)
      console.log(dimGrey('Shutdown completed.'))
      process.exit(0)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}

/**
 * Convenience function.
 */
export async function startServer(cfg: StartServerCfg): Promise<StartServerData> {
  try {
    const server = new BackendServer(cfg)
    return await server.start()
  } catch (err) {
    cfg.sentryService?.captureException(err)
    throw err
  }
}

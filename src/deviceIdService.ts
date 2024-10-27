/// <reference lib="dom" preserve="true" />

import { isServerSide } from './env'
import { nanoidBrowser } from './nanoid'
import { hashCode } from './string/hash.util'

// This is in sync with the default length in Nanoid.
const deviceIdLength = 21

/**
 * Service to generate, maintain, persist a stable "device id".
 *
 * It's called "device id" and not userId/visitorId, to indicate that it only identifies a device,
 * and has nothing to do with user identification.
 * User might be logged in or not.
 * User id can be the same on multiple devices.
 * DeviceId is unique per device, same User or not.
 *
 * Service provides methods to deterministically select fraction of devices.
 * For example, select 10% of devices that visit the website to be tracked by Analytics
 * (to reduce Analytics quota usage).
 * DeviceId persistence will ensure that recurring visits from the same device will yield the same
 * DeviceId, and same "selection assignment" (like an assignment in an AB test).
 *
 * @experimental
 */
export class DeviceIdService {
  constructor(cfg: DeviceIdServiceCfg = {}) {
    this.cfg = {
      localStorageKey: 'deviceId',
      debug: false,
      ...cfg,
    }

    this.init()
  }

  cfg: Required<DeviceIdServiceCfg>

  /**
   * `deviceId` is null only in anomalous cases, e.g when localStorage is not available (due to e.g "out of disk space" on device).
   * In all other cases it should be defined and stable (persisted indefinitely between multiple visits).
   *
   * It is null if the service is run on the server side.
   */
  deviceId!: string | null

  /**
   * Selects this device based on "deterministic random selection", according to the defined `rate`.
   * Rate is a floating number between 0 and 1.
   * E.g rate of 0.1 means 10% chance of being selected.
   *
   * Selection is based on deviceId, which is generated random and persisted between visits.
   * Persistence ensures that the selection (similar to an AB-test assignment) "sticks" to the device.
   *
   * If deviceId failed to be generated, e.g due to Device running out-of-space to save a string to localStorage,
   * it will NOT be selected.
   *
   * @returns true if the device is selected.
   */
  select(rate: number): boolean {
    if (!this.deviceId) {
      this.debug(`deviceId is null, skipping selection`)
      return false
    }

    const mod = Math.trunc(rate * 1000)
    // console.log('hash: ', hashCode(this.deviceId)) // todo

    return hashCode(this.deviceId) % 1000 < mod
  }

  /**
   * Deletes the persisted deviceId.
   * Keeps it in the service.
   * To remove it from the service, assign deviceIdService.deviceId = null.
   */
  clearPersistence(): void {
    try {
      globalThis.localStorage.removeItem(this.cfg.localStorageKey)
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Generates a stable Device id if it wasn't previously generated on this device.
   * Otherwise, reads a Device id from persistent storage.
   */
  private init(): void {
    this.deviceId = null
    if (isServerSide()) return

    try {
      this.deviceId = globalThis.localStorage.getItem(this.cfg.localStorageKey)
      if (this.deviceId) this.debug(`loaded deviceId: ${this.deviceId}`)
    } catch (err) {
      console.log(err)
      this.deviceId = null
    }

    if (this.deviceId && this.deviceId.length !== deviceIdLength) {
      console.warn(
        `[DeviceIdService] unexpected deviceIdLength (${this.deviceId.length}), will re-generate the id`,
        { deviceId: this.deviceId },
      )
      this.deviceId = null
    }

    if (!this.deviceId) {
      try {
        this.deviceId = nanoidBrowser(deviceIdLength)
        this.debug(`generated new deviceId: ${this.deviceId}`)
        globalThis.localStorage.setItem(this.cfg.localStorageKey, this.deviceId)
      } catch (err) {
        console.log(err)
        this.deviceId = null
      }
    }
  }

  private debug(...args: any[]): void {
    if (this.cfg.debug) console.log('[DeviceIdService]', ...args)
  }
}

export interface DeviceIdServiceCfg {
  /**
   * Default: deviceId
   */
  localStorageKey?: string

  /**
   * Set to true to enable debug logging.
   */
  debug?: boolean
}

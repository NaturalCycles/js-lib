import type { UnixTimestamp } from '@naturalcycles/js-lib'

export const MOCK_TS_2018_06_21 = 1_529_539_200 as UnixTimestamp

/**
 * Locks time-related functions to return always same time.
 * For deterministic tests.
 */
export function mockTime(ts = MOCK_TS_2018_06_21): void {
  const timekeeper = require('timekeeper')
  timekeeper.freeze(ts * 1000)
}

export function resetTime(): void {
  const timekeeper = require('timekeeper')
  timekeeper.reset()
}

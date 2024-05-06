/*

yarn tsn testLocalDateTimezones

It's a separate script, because our jest setup always runs in UTC.

 */

import { runScript } from '@naturalcycles/nodejs-lib'
import { localDateToday } from '../src'

runScript(async () => {
  let d = localDateToday().toDateInUTC()
  console.log(d.toString())
  console.log(d.toISOString())
  console.log(d.toUTCString())
  console.log(d.getTimezoneOffset())
  console.log(
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      // timeZone: 'UTC',
      calendar: 'gregory',
    }).format(d),
  )
  console.log(
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
      calendar: 'gregory',
    }).format(d),
  )

  d = localDateToday().toDate()
  console.log(d.toString())
  console.log(d.toISOString())
  console.log(d.toUTCString())
  console.log(d.getTimezoneOffset())
  console.log(
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      // timeZone: 'UTC',
      calendar: 'gregory',
    }).format(d),
  )
  console.log(
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
      calendar: 'gregory',
    }).format(d),
  )
})

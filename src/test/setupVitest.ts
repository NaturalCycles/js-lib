console.log('setupVitest.ts is called')
process.env.TZ = 'UTC'
process.env['APP_ENV'] = 'test'
process.env['JEST_SILENT'] = 'true'

import { testOffline } from '../testing'

testOffline()

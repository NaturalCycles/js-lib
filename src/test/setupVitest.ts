console.log('setupVitest.ts is called')
process.env.TZ = 'UTC'
process.env['JEST_SILENT'] = 'true'

import { testOffline } from '@naturalcycles/dev-lib/dist/testing'

testOffline()

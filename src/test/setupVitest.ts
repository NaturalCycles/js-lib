console.log('setupVitest.ts is called')
process.env.TZ = 'UTC'

import { jestOffline } from '@naturalcycles/dev-lib/dist/testing'

jestOffline()

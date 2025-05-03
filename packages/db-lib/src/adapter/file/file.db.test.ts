import { describe } from 'vitest'
import { runCommonDaoTest, runCommonDBTest } from '../../testing/index.js'
import { FileDB } from './file.db.js'
import { InMemoryPersistencePlugin } from './inMemory.persistence.plugin.js'

const db = new FileDB({
  plugin: new InMemoryPersistencePlugin(),
})

describe('runCommonDBTest', async () => {
  await runCommonDBTest(db)
})

describe('runCommonDaoTest', async () => {
  await runCommonDaoTest(db)
})

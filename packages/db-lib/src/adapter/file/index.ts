import { FileDB } from './file.db.js'
import type { FileDBCfg, FileDBPersistencePlugin } from './file.db.model.js'
import { LocalFilePersistencePlugin } from './localFile.persistence.plugin.js'

export type { FileDBCfg, FileDBPersistencePlugin }
export { FileDB, LocalFilePersistencePlugin }

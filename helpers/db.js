import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// LowDB implementation for monitoring
export default class GrowbakDB {
  constructor(dbName) {
    const __dbDirname = dirname(fileURLToPath(import.meta.url));
    const mainFile = join(__dbDirname,'..', 'lowdb', `${dbName}.json`);
    const adapter = new JSONFile(mainFile);
    this.db = new Low(adapter);
    this.init();
    this.db.data = this.db.data || {}
    console.log(`Low DB is using ${mainFile}.`)
  }

  async init() {
    await this.db.read()
  }
}
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// LowDB implementation for monitoring
export default class GrowbakDB {
  constructor() {
    const __dbDirname = dirname(fileURLToPath(import.meta.url));
    const mainFile = join(__dbDirname,'..', 'lowdb', 'main-db.json');
    console.log(`Low DB writing in ${mainFile}.`)
  }


}

// handle path and multiple files

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read()
db.data = db.data || { stores: {} }
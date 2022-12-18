// Fetch user based on search term, counting all occurences
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// File path
const __mainDirname = dirname(fileURLToPath(import.meta.url));
const mainFile = join(__mainDirname, 'main-db.json');
console.log(`Low DB writing in ${mainFile}.`)

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read()
db.data = db.data || { stores: {} }

for (let i=0; i<5; i++) {
  let seed = (i + Math.floor(Math.random() * 999999));
  let seedVal = seed * Math.floor(Math.random() * 999);
  db.data.stores[seed] = seedVal.toString(32);
}

await db.write()
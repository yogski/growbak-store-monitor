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
    try {
      this.init();
    } catch (error) {
      console.log(error);
    }
    this.db.data = this.db.data || {}
    console.log(`Low DB is using ${mainFile}.`)
  }

  async init() {
    await this.db.read()
  }

  sortArrayByField (objArray = [], field = "", order = "asc", select = objArray.length) {
    if (objArray.length === 0) return objArray;
    if (!objArray[0][field]) return new Error(`Cannot find "${field}" field. Please ensure selected field is correct.`);
    if (order.toLowerCase() === "asc") {
      if (typeof objArray[0][field] === "number") {
        return objArray.slice(0).sort((a,b) => a[field] - b[field]).slice(0,select);
      } else if (typeof objArray[0][field] === "string") {
        return objArray.slice(0).sort((a,b) => a[field].localeCompare(b[field])).slice(0,select);
      } else {
        return objArray.slice(0,select);
      }
    } else if (order.toLowerCase() === "desc") {
      if (typeof objArray[0][field] === "number") {
        return objArray.slice(0).sort((a,b) => b[field] - a[field]).slice(0,select);
      } else if (typeof objArray[0][field] === "string") {
        return objArray.slice(0).sort((a,b) => b[field].localeCompare(a[field])).slice(0,select);
      } else {
        return objArray.slice(0,select);
      }
    } else {
      return objArray.slice(0,select);
    }
  }
}

export const initShopDB = () => {
  try {
    let shopDB = new GrowbakDB("shop-db");
    if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
    if (!shopDB.db.data.summary) { shopDB.db.data.summary = {} }
    return shopDB;
  } catch (error) {  
    throw new Error(error);
  }
}

export const initShopProductDB = () => {
  try {
    let shopDB = new GrowbakDB("shop-product-db");
    if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
    if (!shopDB.db.data.summary) { shopDB.db.data.summary = {} }
    return shopDB;
  } catch (error) {  
    throw new Error(error);
  }
}

export const initShopPerformanceDB = () => {
  try {
    let shopDB = new GrowbakDB("shop-performance-db");
    if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
    if (!shopDB.db.data.summary) { shopDB.db.data.summary = {} }
    return shopDB;
  } catch (error) {  
    throw new Error(error);
  }
}

export const initProductLastSavedDB = () => {
  try {
    let lastProductDB = new GrowbakDB("product-last-saved-db");
    if (!lastProductDB.db.data.products) { shopDB.db.data.products = {} }
    if (!lastProductDB.db.data.summary) { lastProductDB.db.data.summary = {} }
    return lastProductDB;
  } catch (error) {  
    throw new Error(error);
  }
}

export const initConfigDB = () => {
  try {
    let configDB = new GrowbakDB("config-db");
    if (!configDB.db.data.config) { configDB.db.data.config = {} }
    return configDB;
  } catch (error) {  
    throw new Error(error);
  }
}

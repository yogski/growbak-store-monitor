import GrowbakDB from '../helpers/db.js'
import ShopeeAPI from '../helpers/shopee-api.js';
import TimeHelper from '../helpers/time.js';
import yargs from 'yargs';
import MessageHelper from '../helpers/message.js';

/*
prefill-products.js 
Fill information about shop categories and products.
It will contain essential and rarely changing information like category ID and product ID.

Run this after prefill-shops.js.
*/

const args = yargs(process.argv.slice(2));
let requestLimit = 10;
let requestConfig = {}
let queryConfig = {
  order: "asc",
  sort: "shop_id",
  refresh: false,
  list: false,
  select: undefined
}

if (Object.keys(args.argv).length <= 2) {
  MessageHelper.PrefillProductsHelp()
  process.exit(0)
} else {
  for (const key in args.argv) {
    switch (key) {
      case "sort":
        queryConfig["sort"] = args.argv[key]
        break;
      case "order":
        queryConfig["order"] = args.argv[key]
        break;
      case "select":
        queryConfig["select"] = args.argv[key]
        break;
      case "r":
        queryConfig["refresh"] = true
        break;
      case "l":
        queryConfig["list"] = true
        break;
      default:
        break;
    }
  }
}

let shopDB, shopProductDB;
try {
  shopDB = new GrowbakDB("shop-db");
  if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
  if (!shopDB.db.data.summary) { shopDB.db.data.summary = {} }  

  shopProductDB = new GrowbakDB("shop-product-db");
  if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
} catch (error) {  
  console.log(error);
}

try {
  console.log(`Searching for shops named ${args.argv._[0]}...`)
  const shopList = await ShopeeAPI.getShopsByKeyword(args.argv._[0],requestLimit,0,requestConfig);
  if (shopList.shops.length === 0 && shopList.maxOffset <= 1) {
    console.log(`No entries found for ${args.argv._[0]}. Exiting...`)
    process.exit(0)
  } else {
    console.log(`${shopList.maxOffset * requestLimit}+ entries found. Processing...`)
  }

  let newDataCount = 0;
  for (let i=0; i<shopList.shops.length; i++) {
    if (!shopDB.db.data.shops[shopList.shops[i].shopid]) {
      shopDB.db.data.shops[shopList.shops[i].shopid] = shopList.shops[i]
      newDataCount++
    }
  }
  console.log("Writing to Database...")
  await shopDB.db.write()

  if (shopList.maxOffset > 1) {
    for (let j=1; j<shopList.maxOffset; j++) {
      console.log(`Fetching extra pages: ${j} of ${shopList.maxOffset - 1}`)
      const moreShops = await ShopeeAPI.getShopsByKeyword(args.argv._[0],requestLimit,j,requestConfig);
      for (let jj=0; jj<moreShops.shops.length; jj++) {
        if (!shopDB.db.data.shops[moreShops.shops[jj].shopid]) {
          shopDB.db.data.shops[moreShops.shops[jj].shopid] = moreShops.shops[jj]
          newDataCount++
        }
      }
      await TimeHelper.delay(Math.log10((2*j - 1) * 1000) * 500);
      console.log("Writing to Database...")
      await shopDB.db.write()
    }
  }

} catch (error) {
  console.log(error);
}

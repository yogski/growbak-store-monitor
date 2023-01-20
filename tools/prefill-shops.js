import GrowbakDB from '../helpers/db.js'
import ShopeeAPI from '../helpers/shopee-api.js';
import TimeHelper from '../helpers/time.js';
import yargs from 'yargs';
import MessageHelper from '../helpers/message.js';

/*
===================================================================
prefill-shops.js 
Populate database shop-db.json with shops based on search term.
Used for determine which shops will be monitored.
shop-db.json will store essential data and mostly unchanged like username and ID.

Run this script if you are using Growbak for the first time.
===================================================================
*/

const args = yargs(process.argv.slice(2));
let requestLimit = 10;
let requestConfig = {}

if (Object.keys(args.argv).length <= 2) {
  MessageHelper.PrefillShopHelp()
  process.exit(0);
} else {
  for (const argKey in args.argv) {
    switch (argKey) {
      case "min-follower":
        requestConfig["minFollower"] = args.argv[argKey]
        break;
      case "max-follower":
        requestConfig["maxFollower"] = args.argv[argKey]
        break;
      case "min-rating":
        requestConfig["minRating"] = args.argv[argKey]
        break;
      case "max-rating":
        requestConfig["maxRating"] = args.argv[argKey]
        break;
      case "is-official":
        requestConfig["isOfficial"] = true
        break;
      case "f":
        requestConfig["isOfficial"] = true
        break;
      case "limit":
        requestLimit = args.argv[argKey]
        break;
      default:
        break;
    }
  }
}

let shopDB;
try {
  shopDB = new GrowbakDB("shop-db");
  if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
  if (!shopDB.db.data.summary) { shopDB.db.data.summary = {} }  
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
      console.log("Writing to Database...")
      await shopDB.db.write()
    }
  }
  

  if (shopList.maxOffset > 1) {
    for (let j=1; j<shopList.maxOffset; j++) {
      console.log(`Fetching extra pages: ${j} of ${shopList.maxOffset - 1}`)
      const moreShops = await ShopeeAPI.getShopsByKeyword(args.argv._[0],requestLimit,j,requestConfig);
      for (let jj=0; jj<moreShops.shops.length; jj++) {
        if (!shopDB.db.data.shops[moreShops.shops[jj].shopid]) {
          shopDB.db.data.shops[moreShops.shops[jj].shopid] = moreShops.shops[jj]
          newDataCount++
          console.log("Writing to Database...")
          await shopDB.db.write()    
        }
      }
      await TimeHelper.delay(Math.log10((2*j - 1) * 1000) * 500);
    }
  }

  // recount database
  console.log("summarizing data...")
  shopDB.db.data.summary.shop_count = Object.keys(shopDB.db.data.shops).length;
  shopDB.db.data.summary.total_product_count = Object.entries(shopDB.db.data.shops).reduce((acc, arr) => acc + arr[1].product_count, 0)
  await shopDB.db.write()

  console.log("Done!")
} catch (error) {
  console.log(error);
}

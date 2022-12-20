import GrowbakDB from '../helpers/db.js'
import ShopeeAPI from '../helpers/shopee-api.js';
import TimeHelper from '../helpers/time.js';
import yargs from 'yargs';
import MessageHelper from '../helpers/message.js';

/*
prefill.js 
Fetch user based on search term, then save it to DB. 
Used for determine which item will be monitored.

Run this script if you are using Growbak for the first time.
*/

const args = yargs(process.argv.slice(2));
let requestLimit = 10;
let requestConfig = {}

if (Object.keys(args.argv).length <= 2) {
  MessageHelper.PrefillHelp()
  process.exit()
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
} catch (error) {  
  console.log(error);
}

try {
  console.log(`Searching for shops named ${args.argv._[0]}...`)
  const shopList = await ShopeeAPI.getShopsByKeyword(args.argv._[0],requestLimit,0,requestConfig);
  if (shopList.shops.length === 0 && shopList.maxOffset <= 1) {
    console.log(`No entries found for ${args.argv._[0]}. Exiting...`)
    process.exit()
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
        if (!shopDB.db.data.shops[shopList.shops[jj].shopid]) {
          shopDB.db.data.shops[shopList.shops[jj].shopid] = shopList.shops[jj]
          newDataCount++
        }
      }
      await TimeHelper.delay(Math.log10((2*j - 1) * 1000) * 500);
      console.log("Writing to Database...")
      await shopDB.db.write()
    }
  }

  console.log(`Added ${newDataCount} shops to database...`)
} catch (error) {
  console.log(error);
}

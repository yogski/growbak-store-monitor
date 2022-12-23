import GrowbakDB from '../helpers/db.js'
import ShopeeAPI from '../helpers/shopee-api.js';
import TimeHelper from '../helpers/time.js';
import yargs from 'yargs';
import MessageHelper from '../helpers/message.js';

/*
===================================================================
manual-products.js 
Manually fetch product information for all shops in shop-db.json.
===================================================================
*/

let shopDB;
let shopList = [];
try {
  shopDB = new GrowbakDB("shop-db");
  if (!shopDB.db.data.shops) { shopDB.db.data.shops = {} }
  if (!shopDB.db.data.summary) { shopDB.db.data.summary = {} } 
  shopList = Object.keys(shopDB.db.data.shops); 
  console.log(`Found ${shopList.length} shop(s) from database. Fetching data...`)

  productDB = new GrowbakDB("shop-product-db");
} catch (error) {  
  console.error("[ERROR] LowDB Error",error);
  process.exit();
}

try {
  // repeating for each shops
  for (let i=0; i<shopList.length; i++) {
    // todo : add conditions? if later than 24 hours, then can proceed

    // get all products from a shop. one request only
    const productDetails = await ShopeeAPI.getProductsByShopIdAndCategoryId(shopList[i]);

    // fetch data from last saved if exists in product-last-saved.json

    // compare data from API with last saved. don't forget to add handling if nothing is saved a.k.a new product

    // save result to shop-product-db.json

    // calculate the shop performance : revenue, total unit sold, timestamp
    // also do request to shop ID to update likes, rating, follower count, score
  }
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

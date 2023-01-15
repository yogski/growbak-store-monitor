import dotenv from 'dotenv';
dotenv.config();
import { CronJob } from "cron";
import {
  initConfigDB, 
  initProductLastSavedDB,
  initShopDB,
  initShopProductDB,
  initShopPerformanceDB
} from "../helpers/db";

var job = new CronJob(process.env.CRON_SCHEDULE, 
  async () => {
    try {
      // Prepare Database
      const configDB = initConfigDB();
      const lastSavedDB = initProductLastSavedDB();
      const shopPerformanceDB = initShopPerformanceDB();
      const shopProductDB = initShopProductDB();
      const shopDB = initShopDB();

      // sort shops based on last_update, give limit how many entries will be searched.

      // start searching for every selected shop
      // two APIs : get products and get shop details

      // for get products API, loop for each product

      // if product exists on shopProductDB, add new entry with timestamp
      // otherwise, create new product entry

      // if 

      // check product on lastSavedDB, if exist compare newly fetched to last saved
      // otherwise, handle immediately
      // calculate diff stock, sold, rating, etc

      // save 


    } catch (error) {
      console.log(error); 
    }
  },
  null, true, 'Asia/Jakarta'
);

job.start();
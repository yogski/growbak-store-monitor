import dotenv from 'dotenv';
dotenv.config();
import { CronJob } from "cron";
import {
  initConfigDB, 
  initProductLastSavedDB,
  initShopProductDB,
  initShopPerformanceDB
} from "../helpers/db";

var job = new CronJob(process.env.CRON_SCHEDULE, 
  async () => {
    try {
      // Prepare Database
      const configDB = initConfigDB();
      const shopPerformanceDB = initShopPerformanceDB();
      const lastSavedDB = initProductLastSavedDB();
      const shopProductDB = initShopProductDB();

      
    } catch (error) {
      console.log(error); 
    }
  },
  null, true, 'Asia/Jakarta'
);

job.start();
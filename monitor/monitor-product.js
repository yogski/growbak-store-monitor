import dotenv from 'dotenv';
dotenv.config();
import { CronJob } from "cron";

var job = new CronJob(process.env.CRON_SCHEDULE, 
  async () => {
    try {
 
    } catch (error) {
      console.log(error); 
    }
  },
  null, true, 'Asia/Jakarta'
);

job.start();
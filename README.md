# Growbak E-commerce Monitoring (work in progress)

## What Is Growbak?
Growbak is intended as system that monitors status, performance, and revenue of online store in marketplace e-commerce. It is light, easy to use, and non-intrusive.

Under the hood, Growbak uses [Got](https://www.npmjs.com/package/got) as Node.js optimized HTTP request package and [LowDB](https://www.npmjs.com/package/lowdb) as JSON database that can be easily reused.

Supported e-commerce
- [x] Shopee
- [ ] Tokopedia (coming soon...)
- [ ] Lazada (coming soon...)

## How To Install Growbak?
Growbak requires following software installed in your system
- Node.js `v12.17.0` or above.

To install and setup Growbak, follow these steps:
1. Get source code from Github : `$ git clone https://github.com/yogski/growbak-store-monitor.git`
2. Go to repository folder : `$ cd /growbak-store-monitor`
3. Install dependencies : `$ npm install`
4. Initialize database : `$ npm run lowdb-init`
5. Done. Now, based on your monitoring needs, you can configure the setting and run the worker. Refer [here](#how-to-configure-and-run-growbak) for more information.

## How To Configure and Run Growbak
Growbak has scripts needed to monitor e-commerce needs. The scripts are divided into 2 folders:
1. `/tools`, containing scripts needed to figure out which shops and products are to be monitored.
2. `/monitor`, containing worker scripts that will monitor specified shops and products periodically.

## Contributing
- Kindly report bug to issue of this repository
- Also, I appreciate your suggestion to improve Growbak. Pull requests are also welcomed.

## License
MIT
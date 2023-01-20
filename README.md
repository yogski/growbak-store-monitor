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
4. Initialize database : `$ npm run init:lowdb`
5. Done. Now, based on your monitoring needs, you can configure the setting and run the worker. Refer [here](#how-to-configure-and-run-growbak) for more information.

## How To Configure and Run Growbak
Growbak has scripts needed to monitor e-commerce needs. The scripts are divided into 2 folders:
1. `/tools`, containing scripts needed to figure out which shops and products are to be monitored.
2. `/monitor`, containing worker scripts that will monitor specified shops and products periodically.

### First Time Running
Basically, we need to define which shops will be monitored. After fresh installation, Growbak will need to gather the shops data. Basic functions are covered in `/tools`.

#### Gather Shop Data
Growbak can gather shop data based on keyword and some parameters.
The command is `npm run init:shops`. If you run it, information about usage and parameters will be visible.

You may need to run `npm run init:shops` several times with different keywords, depending on your needs. Marketplaces offer public API for their own needs.

## Contributing
- Kindly report bug to issue of this repository
- Also, I appreciate your suggestion to improve Growbak. Pull requests are also welcomed.

## License
MIT
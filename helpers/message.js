export default class MessageHelper {
  static PrefillShopHelp() {
    console.log('==============================================================')
    console.log('Growbak Command : Initialize Shops')
    console.log(`Format : npm run init:shops -- <search_term> <options>`)
    console.log(`Example : npm run init:shops -- fashion --min-follower=1000 -f`)
    console.log(`Available options :`)
    console.log(`--min-follower : minimum shop follower`)
    console.log(`--max-follower : maximum shop follower`)
    console.log(`--min-rating : minimum shop rating (0-5 with decimals)`)
    console.log(`--max-rating : maximum shop rating (0-5 with decimals)`)
    console.log(`--limit : limit display, set default as 10 if omitted`)
    console.log(`-f or --is-official : only includes official shops`)
    console.log('==============================================================')
    return;
  }

  static PrefillProductsHelp() {
    console.log('==============================================================')
    console.log('Growbak Prefill Products Menu')
    console.log(`Command Example : node ./tools/prefill-products.js <options>`)
    console.log(`Available options :`)
    console.log(`-l : display list of available shop IDs from shop-db`)
    console.log(`-r : refresh selected shop IDs to keep categories and products updated`)
    console.log(`--sort : sort by following criteria: "rating", "product", "follower", "name", "shop_id". default to "shop_id"`)
    console.log(`--order : order by "asc" or "desc", default to "asc"`)
    console.log(`--select : select specific number of shops based on ordering and sorting`)
    console.log('==============================================================')
    return;
  }

  static ManualProductsHelp() {
    console.log('==============================================================')
    console.log('Growbak Manual Products Menu')
    console.log(`Command Example : node ./tools/manual-products.js`)
    console.log('==============================================================')
    return;
  }
}
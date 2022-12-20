export default class MessageHelper {
  static PrefillHelp() {
    console.log('==============================')
    console.log('Growbak Prefill Menu')
    console.log(`Command Example : node ./tools/prefill.js <search_term> <options>`)
    console.log(`Available options :`)
    console.log(`--min-follower : minimum shop follower`)
    console.log(`--max-follower : maximum shop follower`)
    console.log(`--min-rating : minimum shop rating (0-5 with decimals)`)
    console.log(`--max-rating : maximum shop rating (0-5 with decimals)`)
    console.log(`--limit : limit display, set default as 10 if omitted`)
    console.log(`-f or --is-official : only includes official shops`)
    console.log('==============================')
    return;
  }
}
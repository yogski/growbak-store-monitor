import ShopeeAPI from "./helpers/shopee-api.js"

console.log("================================================")
console.log("======== Welcome To Growbak Monitoring ========")
console.log("================================================")
let f = async () => {
  return await ShopeeAPI.getShopsByKeyword("eiger");
}

f();
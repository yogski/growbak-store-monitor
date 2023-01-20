import got from "got";
import TimeHelper from "./time.js";

export default class ShopeeAPI {
  /**
   * Get Shop Basic data from search keyword, with configurable display limit and offset.
   * Config available: minFollower, maxFollower, minRating, maxRating, isOfficialShop 
   * @param {string} searchKeyword 
   * @param {number} displayLimit 
   * @param {number} offset 
   * @param {object} config 
   */
  static async getShopsByKeyword(searchKeyword, displayLimit = 10, offset = 0, config = {}) {
    try {
      const getShopsByKeywordBaseURL = "https://shopee.co.id/api/v4/search/search_user";
      let shopsFetched = await got.get(
        getShopsByKeywordBaseURL,
        {
          searchParams : {
            keyword : searchKeyword,
            limit : displayLimit,
            offset : offset,
            page : "search_user",
            with_search_cover : true
          },
          headers : {
            "user-agent" : "PostmanRuntime/7.29.2"
          }
        }
      );
      
      let parsedShops = JSON.parse(shopsFetched.body);
      let maxOffset = Math.ceil((parsedShops.data.total_count - displayLimit) / displayLimit);
      let filteredShops = parsedShops.data.users;
      
      if (config.minFollower) {
        filteredShops = filteredShops.filter((shop) => shop.follower_count >= config.minFollower)
      }

      if (config.maxFollower) {
        filteredShops = filteredShops.filter((shop) => shop.follower_count <= config.maxFollower)
      }

      if (config.minRating) {
        filteredShops = filteredShops.filter((shop) => shop.shop_rating >= config.minRating);
      }

      if (config.maxRating) {
        filteredShops = filteredShops.filter((shop) => shop.shop_rating <= config.maxRating);
      }

      if (config.isOfficial) {
        filteredShops = filteredShops.filter((shop) => shop.is_official_shop == true);
      }

      console.log(`Found ${filteredShops.length} matched criteria.`)

      return {
        maxOffset,
        shops : filteredShops
        .filter((shop) => shop.status === 1)
        .map((shop) => {
           return {
            last_updated : TimeHelper.unixTimestamp() - 1_000_000, // initialized to make sure it's monitored early on
            shopname : shop.shopname,
            country : shop.country,
            follower_count : shop.follower_count,
            is_official_shop : shop.is_official_shop,
            nickname : shop.nickname,
            userid : shop.userid,
            shopid : shop.shopid,
            username : shop.username,
            rating : shop.shop_rating,
            score : shop.score,
            product_count : shop.products
          }
        })
      } ;

    } catch (error) {
      console.log(error);
    }
  }

  static async getShopCategoriesByShopId(shopId) {

    // example API output
    /*
    {
      "shop_category_id": 11042685,
      "display_name": "Hijab",
      "image": "fe008caf18c5b6bca1d3ac353db2e5e2",
      "is_generated": true,
      "category_type": 8,
      "total": 50,
      "is_adult": false
    }
    */
  }

  static async getProductsByShopIdAndCategoryId (shopId, categoryId = -1, config = {}) {
    const getProductsBaseURL = "https://shopee.co.id/api/v4/shop/search_items";
    const SET_LIMIT = config.limit || 30;
    const SET_OFFSET = config.offset || 0;
    const SET_ORDER = config.order || "desc"; // known available : "asc", "desc"
    const SET_SORT = config.sort || "price"; // known available : "pop", "price"
    let productsFetched = await got.get(
      getProductsBaseURL,
      {
        searchParams : {
          filter_sold_out : 0,
          limit : SET_LIMIT,
          offset : SET_OFFSET,
          order : SET_ORDER,
          shopid : shopId,
          sort_by : SET_SORT,
          shop_category_id : categoryId,
          use_case : 1 // leave this be.
        },
        headers : {
          "user-agent" : "PostmanRuntime/7.29.2"
        }
      }
    );

    let parsedProducts = JSON.parse(productsFetched.body);

    if (parsedProducts.error > 0) {
      throw new Error("[ERROR] Error API response from Shopee")
    }

    return {
      count : parsedProducts.total_count || 0,
      shopId : shopId,
      timestamp : TimeHelper.unixTimestamp(),
      products : parsedProducts.items
      .filter((product) => product.item_basic.status >= 1)
      .map((product) => { return {
        itemId : product.item_basic.itemid,
        name : product.item_basic.name,
        lastUpdate : product.item_basic.ctime,
        currency : product.item_basic.currency,
        status : product.item_basic.item_status,
        stock : product.item_basic.stock,
        sold : product.item_basic.sold,
        totalSold : product.item_basic.historical_sold,
        likesCount : product.item_basic.liked_count,
        price : product.item_basic.price,
        // priceBeforeDiscount : product.item_basic.price_before_discount,
        // discount : product.item_basic.raw_discount,
        averageRating : product.item_basic.item_rating.rating_star || 0,
        ratingCount : product.item_basic.item_rating.rating_count[0] || 0,
        ratingDetails : product.item_basic.item_rating.rating_count.slice(1)
      } })
    }
  }
}
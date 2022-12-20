import got from "got";

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
      let shopsFetched = await got.get(
        "https://shopee.co.id/api/v4/search/search_user",
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
            shopname : shop.shopname,
            country : shop.country,
            follower_count : shop.follower_count,
            is_official_shop : shop.is_official_shop,
            nickname : shop.nickname,
            userid : shop.userid,
            shopid : shop.shopid,
            username : shop.username
          }
        })
      } ;

    } catch (error) {
      console.log(error);
    }
    // example API output
    /*
    {
      "shopname": "Nadiraa Hijab Official Shop",
      "status": 1,
      "country": "id",
      "followed": null,
      "follower_count": 538743,
      "following_count": 1016,
      "is_official_shop": true,
      "last_login_time": 1671257577,
      "nickname": "Nadiraa Hijab Official Shop",
      "pickup_address_id": 2098934,
      "portrait": "290c10ae23901c466d7df96c6b63adf8",
      "products": 143,
      "response_rate": 82,
      "response_time": 7661,
      "score": 552440,
      "shop_rating": 4.838256,
      "shopee_verified_flag": 0,
      "show_official_shop_label": true,
      "show_shopee_verified_label": false,
      "userid": 23017999,
      "shopid": 23016663,
      "username": "nadiraa_hijab",
      "data": null,
      "json_data": "",
      "adsid": 0,
      "recall_type": 6,
      "customisation": null,
      "banner_ads": null,
      "ps_plus": false,
      "items": null,
      "shop_vouchers": null,
      "search_info": null,
      "bff_info": null
    }
    */

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

  static async getProductsByShopIdAndCategoryId (shopId, categoryId) {

    // example API output
    /*
      {
          "itemid": 15094166097,
          "shopid": 66654245,
          "item_basic": {
              "itemid": 15094166097,
              "shopid": 66654245,
              "name": "NUZ Jilbab Sport Nadira Jersey Daily Hijab Sporty Premium I Kerudung Olahraga By Shamira",
              "label_ids": [
                  1000167,
                  1000211,
                  1000206,
                  1000544,
                  1000584,
                  1001176,
                  1011707,
                  1012617,
                  1012616,
                  1012618,
                  1012619,
                  1012469,
                  1012482,
                  1012468,
                  1012706,
                  1012709,
                  1012710,
                  1012711,
                  1012708,
                  1013298,
                  1013398,
                  1013853,
                  1013478,
                  1013625,
                  1014369,
                  1014368,
                  1014385,
                  1013602,
                  1068674,
                  1068675,
                  1400025088,
                  700085134,
                  700066224,
                  1400085050,
                  700066226,
                  1400085065,
                  700066574,
                  700020158,
                  1000031,
                  1000668,
                  1000006,
                  1015914,
                  700085500,
                  700085499,
                  1143704,
                  1115189
              ],
              "image": "sg-11134201-22100-3sge3ah7zwiv01",
              "images": [
                  "sg-11134201-22100-3sge3ah7zwiv01",
                  "sg-11134201-22100-dux6rpt7zwivdf",
                  "sg-11134201-22100-0qkilf77zwiv36",
                  "sg-11134201-22100-ta0hf8n8zwiv00"
              ],
              "currency": "IDR",
              "stock": 1200,
              "status": 1,
              "ctime": 1666316078,
              "sold": 1214,
              "historical_sold": 1514,
              "liked": false,
              "liked_count": 162,
              "catid": 100014,
              "brand": "",
              "cmt_count": 329,
              "flag": 196608,
              "cb_option": 0,
              "item_status": "normal",
              "price": 1099900000,
              "price_min": 1099900000,
              "price_max": 1099900000,
              "price_min_before_discount": 1500000000,
              "price_max_before_discount": 1500000000,
              "price_before_discount": 1500000000,
              "has_lowest_price_guarantee": false,
              "show_discount": 27,
              "raw_discount": 27,
              "discount": "27%",
              "size_chart": "",
              "tier_variations": [
                  {
                      "name": "WARNA",
                      "options": [
                          "HITAM",
                          "COKSU",
                          "MOCCA",
                          "MILO",
                          "DARK CHOCO",
                          "PUTIH",
                          "NAVY",
                          "DARK GREY",
                          "SILVER",
                          "MAROON"
                      ],
                      "images": [
                          "sg-11134201-22100-68anys5b1wiv97",
                          "sg-11134201-22100-oz6sb8fc1wiva9",
                          "sg-11134201-22100-1skh4cnc1wivdc",
                          "sg-11134201-22100-hpch1ruc1wiv8b",
                          "sg-11134201-22100-3sc4az4c1wivc5",
                          "sg-11134201-22100-sucqfuke1wiv0b",
                          "sg-11134201-22100-kwshi4be1wiv01",
                          "sg-11134201-22100-qj6pckvd1wiv1e",
                          "sg-11134201-22100-wtmg8ehd1wiv87",
                          "sg-11134201-22100-cikjwfwq1wiv09"
                      ],
                      "type": 0
                  }
              ],
              "item_rating": {
                  "rating_star": 4.537993920972644,
                  "rating_count": [
                      329,
                      8,
                      8,
                      21,
                      54,
                      238
                  ],
                  "rcount_with_context": 117,
                  "rcount_with_image": 44
              },
              "item_type": 0,
              "reference_item_id": "",
              "transparent_background_image": "",
              "is_adult": false,
              "badge_icon_type": 0,
              "shopee_verified": true,
              "is_official_shop": false,
              "show_official_shop_label": false,
              "show_shopee_verified_label": true,
              "show_official_shop_label_in_title": false,
              "is_cc_installment_payment_eligible": false,
              "is_non_cc_installment_payment_eligible": false,
              "show_free_shipping": false,
              "bundle_deal_id": 0,
              "can_use_bundle_deal": false,
              "welcome_package_type": 0,
              "can_use_wholesale": false,
              "is_preferred_plus_seller": false,
              "shop_location": "KAB. TASIKMALAYA",
              "has_model_with_available_shopee_stock": false,
              "can_use_cod": true,
              "is_on_flash_sale": false,
              "is_mart": false,
              "deep_discount_skin": {
                  "skin_id": 0,
                  "start_time": 0,
                  "end_time": 0,
                  "skin_data": {
                      "promo_label": {
                          "promotion_price": "Rp 10.700",
                          "hidden_promotion_price": "Rp ?0.700",
                          "start_time": 1671901200,
                          "end_time": 1671987599
                      }
                  }
              },
              "is_service_by_shopee": false
          }
      }
    */
  }
}
# Research Notes on Shopee API

## What to do
- Track shops
  - followers (periodic)
  - rating (periodic)
  - product lists (periodic)
  - product rating (periodic)
  - revenues (periodic)
- Track products
  - price
  - discounts
  - purchases
  - ratings
- Flash Sale
  - discount
  - availability
  - sold out velocity

1. Need to fulfill data of shop ID, category ID and product ID, then the monitoring can happen
2. Need to calculate how many calculation is possible with API request throttling in mind (1 req per 3 seconds is acceptable, try to fiddle around)
3. 

## What to store
- Store ID
  - product IDs
  - category IDs

Example JSON for **shop-db.json**
```
stores :{
  "22947618": {
    "shopname": "Some Store",
    "country": "id",
    "follower_count": 12830,
    "is_official_shop": false,
    "nickname": "Some Store",
    "userid": 22949002,
    "shopid": 22947618,
    "username": "some_store",
    "rating": 5,
    "score": 3155,
    "product_count": 50
  },
},
summary : {
  shop_count : 1,
  total_product_count : 50
} 
```
Example JSON for **shop-product-db.json**
```
shops : {
  "shopid182736" : {
    "productId2783" : {
      [
        timestamp : 
        deltaSold : (periodSold - periodSold from last saved item)
        deltaLikes : (likes now - likes from last saved)
        deltaStock : 
      ]

    }
  }
}
```

Example JSON for **product-last-saved-db.json**
```
shops : {
  "182736" : {
    last_updated : 387216387, // unix timestamp
    category_ids : {
      "3265383" : "New Arrival",
      "3128735" : "Alat Dapur",
      "7231936" : "Toiletries"
    },
  }
}
```
Use `Object.keys(db.data.shops[shop_id][category_ids])` to get list of `category_id`.
Or just search without category_id, will display all products anyway


Example DB for **stores-db.json**
```
stores : {
  storeId1 : {
    shopId : 219837,
    userId : 141378,
    username : "toko_jeng",
    products : 800,
    country : "id",
  },
  storeId2 : {...}
}
```

## Info
- Product detail URL : https://shopee.co.id/product/{shop ID}/{item ID}
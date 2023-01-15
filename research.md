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
- Shop DB : general information of a store
- Shop Product DB : List of product and its stats in a store
- Store Performance DB: summary of store performance, basically sum of its products and stats as well
- Product Last Saved DB : snapshot of product information, which will be compared to newer data
- Config DB : store configuration for Growbak
  - maxDailyRequests : max limit of daily requests. need more reseach, but 1000 requests/day seems reasonable
  - requestCount : counter of current request, reset to 0 at 00:00 system time

Example JSON for **shop-db.json**
```
stores :{
  "22947618": {
    "last_updated": 1982639213, // for sorting purpose
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
        currentPrice : (for reference in future. because revenue = lastPrice * deltaSold)
        deltaReview : []
      ],
      [...]
    }, 
    {...}
  }
},
summary : {
  shop_count : 2,
  total_product_count : 333
}
```

Example JSON for **product-last-saved-db.json**
```
products : {
  "product182736" : {
    last_updated : 387216387, // unix timestamp
    name : "product name"
    status : 1
    stock : 29
    sold : 11
    total_sold : 380
    likes_count : 3
    price : 73200000
    average_rating : 4.5
    rating_details : [15,1,2,1,1,10] // designed such that ratingTotal = rating_details[0], rating1Star = rating_details[1], etc
  },
  {...}
}
```

Example DB for **config-db.json**
```
config : {
  max_daily_request : 1000,
  request_count : 31
}
```

## Info
- Product detail URL : https://shopee.co.id/product/{shop ID}/{item ID}
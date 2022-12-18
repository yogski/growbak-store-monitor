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

Example JSON for **main-db.json**
```
stores : {
  storeId1 : {
    categoryId1 : [
      productId1,
      productId2,
      productId3,
      ...
    ],
    categoryId2 : [...]
  },
  storeId2 : {...}
}
```

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
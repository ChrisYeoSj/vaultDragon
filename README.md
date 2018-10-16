## Vault Dragon Coding Test

### Object Schema

```
name: String (required)
value: Any (required)
timestamp: Date (not required)
```
## How to use the API

### URL
[http://christopher-yeo.com](http://christopher-yeo.com)

### POST   

```
POST /object http://christopher-yeo.com/object
```
Example payload:

```javascript
    {
      "456": {
        "streetAddress": "21 2nd Street",
        "city": "New York",
        "state": "NY",
        "postalCode": "10021"
      }
    }

    OR

    {
      "123": "456",
    }
```

### GET

```
GET /object/{key} http://christopher-yeo.com/object/:key

GET /object/{key}?timestamp={unixTimestamp}  http://christopher-yeo.com/object/:key?timestamp=############
```
Example Requests:

```
GET /object/{key} http://christopher-yeo.com/object/456

GET /object/{key}?timestamp={unixTimestamp} http://christopher-yeo.com/object/456?timestamp=1539541614
```

## Setting Up (If needed)

```sh
yarn install
yarn start
```

## Running Tests

```sh
yarn test
```

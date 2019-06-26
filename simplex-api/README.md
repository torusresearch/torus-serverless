# Simplex backend API

Full backend api to integrate simplex crypto api

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Setup `.env` file with following variable
```
WALLET_ID=
QUOTE_EP=https://sandbox.test-simplexcc.com/wallet/merchant/v2/quote
ORDER_EP=https://sandbox.test-simplexcc.com/wallet/merchant/v2/payments/partner/data
PAYMENT_EP=https://sandbox.test-simplexcc.com/payments/new
SIMPLEX_APIKEY=
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
API_HOST=

API_KEY=
API_KEY_HEADER=apikey
IOS_REFERER=
ANDROID_REFERER=
```

### Installing
```
npm install
```
Please refer to [docker](docker.com) on installation of docker and docker-compose
## Running the tests

```
npm run test
```

## Deploy in local machine
build local image in api folder using
```
docker build . -t simplex-api
```
then, in the main folder

```
docker-compose up
```

## External APIs

### Status

post requests:
- /quote\
    returns a quote for the provided input\
    parameter object:
    ```javascript
    {
    digital_currency: "",
    fiat_currency: '',
    requested_currency: "",
    requested_amount "" 'must be a number
    }
    ```
    - from currency
    - to currency
    - from amount

get request(s):
- /status/:user_id\
    gets the latest status for the particular user_id
   - response:
    ```javascript

  {
      user_id: <string>,
      status: <string>,
      fiat_total_amount: {
          currency: <string>,
          amount: <string>
          },
      requested_digital_amount: {
          currency: <string>,
          amount: <string>
          }
    }
    ```

    - The user_id supplied to the status endpoint the same user_id used to generate the order.
    - The status is updated when an event containing the user_id appears.
    - Note: The user_id is created on a per order basis, so no correlation exists between various orders.


#### Debuging

Logging Namespaces:

validation:bypass

request:
routes-order
routes-quote

response:
routes-order
routes-quote

calls:
getOrder
getQuote

## Built With

* [ExpressJS](https://expressjs.com/) - The web framework
* [Mocha](https://mochajs.org/) - The testing framework

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


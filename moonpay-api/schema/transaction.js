var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
  "moonpayId":{
    type: String,
    required: true,
  },
  "timeUpdated":{
    type: Date,
    required: true
  },
  "public_address":{
    type: String,
    required: true
  },
  "createdAt":{
    type: Date,
    required: true
  },
  "updatedAt":{
    type: Date,
    required: true
  },
  "baseCurrencyAmount":{
    type: Number,
    required: true
  },
  "quoteCurrencyAmount":{
    type: Number,
    required: true
  },
  "feeAmount":{
    type: Number,
    required: true
  },
  "extraFeeAmount":{
    type: Number,
    required: true
  },
  "areFeesIncluded":{
    type: Boolean,
    required: false
  },
  "status":{
    type:String,
    required: true
  },
  "walletAddress":{
    type:String,
    required: true
  },
  "walletAddressTag":{
    type:String,
    default: null
  },
  "cryptoTransactionId":{
    type:String,
    default: null
  },
  "failureReason":{
    type:String,
    default: null
  },
  "returnUrl":{
    type:String,
    required: false,
  },
  "redirectUrl":{
    type:String,
    required: false,
  },
  "baseCurrencyId":{
    type:String,
    required: false,
  },
  "currencyId":{
    type:String,
    required: false,
  },
  "moonpayCustomerId":{
    type:String,
    required: false,
  },
  "cardId":{
    type:String,
    required: true,
  },
  "eurRate":{
    type:Number,
    required: true,
  },
  "usdRate":{
    type:Number,
    required: true,},
  "gbpRate":{
    type:Number,
    required: true,
  }
});

module.exports = mongoose.model('transaction', transactionSchema);

// {
//   data: {
//     id: '3a3794c2-bac2-4b96-9a57-e2193880f4a2',
//     createdAt: '2019-08-22T04:01:50.162Z',
//     updatedAt: '2019-08-22T04:02:02.944Z',
//     baseCurrencyAmount: 20,
//     quoteCurrencyAmount: 0.11633,
//     feeAmount: 4.99,
//     extraFeeAmount: 0,
//     areFeesIncluded: false,
//     status: 'pending',
//     walletAddress: '0xd872b389BCd34b45901d8E4d99D8EE7A33FAF3f6',
//     walletAddressTag: null,
//     cryptoTransactionId: null,
//     failureReason: null,
//     returnUrl: 'https://buy-staging.moonpay.io/transaction_receipt',
//     redirectUrl: 'https://api.moonpay.io/v2/three_d_secure?transactionId=3a3794c2-bac2-4b96-9a57-e2193880f4a2',
//     baseCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
//     currencyId: '8d305f63-1fd7-4e01-a220-8445e591aec4',
//     customerId: '6d7a6ae3-207c-47e4-9012-e8a489439d23',
//     cardId: 'ba4f019b-0f3a-4c3a-94b0-10dc1007387b',
//     eurRate: 1,
//     usdRate: 1.10885,
//     gbpRate: 0.91413
//   },
//   type: 'transaction_updated',
//   externalCustomerId: '0xd872b389BCd34b45901d8E4d99D8EE7A33FAF3f6'
// }
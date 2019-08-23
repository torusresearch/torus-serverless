/**
* Express Router for moonpay transactions
* @author Shubham
* @module Transactions
*/

/**
* express module
* @const
* @ignore
*/

const express = require('express')

/**
* Express router to mount user related functions on.
* @type {object}
* @const
*/
const router = express.Router()
const log = require("loglevel")
const mongoose = require("mongoose")
const transaction = require("../schema/transaction")

//const logger = createLogger('transaction.js')

// Validations file
const validatePostMoonpayTransaction = require('../validations/postMoonpayTransaction')

/** 
* Creates a new transaction: Router validates the passed tx body and pushes it to the database table.
* @name /transaction POST
* @function
* @param {string} path relative express path
* @param {callback} middleware express middleware
* @returns {Boolean} Reponse from adding a transaction
*
* @example
* const body = { *** Tx details *** }
* fetch('/transaction', {method: POST}).send(body)
* //{success: true}
*/
router.post("/", (req, res) => {
  log.info("req.body is", req.body);
  
  const {errors, isValid} = validatePostMoonpayTransaction(req.body);
  //console.log(errors, isValid);
  if (!isValid) {
    log.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try{
    const tx = new transaction({
      "moonpayId": req.body.data.id,
      "public_address": req.body.externalCustomerId,
      "createdAt": req.body.data.createdAt,
      "updatedAt": req.body.data.updatedAt,
      "baseCurrencyAmount": req.body.data.baseCurrencyAmount,
      "quoteCurrencyAmount": req.body.data.quoteCurrencyAmount,
      "feeAmount": req.body.data.feeAmount,
      "extraFeeAmount": req.body.data.extraFeeAmount,
      "areFeesIncluded": req.body.data.areFeesIncluded,
      "status": req.body.data.status,
      "walletAddress": req.body.data.walletAddress,
      "walletAddressTag": req.body.data.walletAddressTag,
      "cryptoTransactionId": req.body.data.cryptoTransactionId,
      "failureReason": req.body.data.failureReason,
      "returnUrl": req.body.data.returnUrl,
      "redirectUrl": req.body.data.redirectUrl,
      "baseCurrencyId": req.body.data.baseCurrencyId,
      "currencyId": req.body.data.currencyId,
      "moonpayCustomerId": req.body.data.customerId,
      "cardId": req.body.data.cardId,
      "eurRate": req.body.data.eurRate,
      "usdRate": req.body.data.usdRate,
      "gbpRate": req.body.data.gbpRate
    })
    transaction.findOne({moonpayId: tx.moonpayId}, (err, doc) => {
      if (err) { console.log(err); res.status(500).json({err: err})
      if(doc == null ){
        tx.save().then(doc=>{
          console.log(doc);
          return res.status(201).json({ success: true , data: doc});
        }).catch(err => console.log(err))
      }
      else if(doc.moonpayId == tx.moonpayId){
        for(key in doc){
          doc[key] = tx[key]
        }
        doc.save(function(err){
          if(err){ console.log(err); res.status(500).json({err: err})}
          res.send(200).json({data: 'moonpay-transaction modified'})
        })
      }
    }
  })
    
  }catch(err){
    console.log(err)
  }
});


/**
* Returns a welcome string
* @name / GET
* @function
* @param {string} path relative express path
* @param {callback} middleware express middleware
* @returns {String} welcome strign
* @example
* // Set auth headers
* fetch("/")
* -> "Welcome to Torus moonpay-apis /transaction"
*/
router.get('/', (req, res) => {
  res.send('Welcome to Torus moonpay-apis /transaction')
})

module.exports = router;

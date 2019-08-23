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
const crypto = require('crypto');

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
  // log.info(req.headers)
  // log.info("req.body.data.status is", req.body.data.status, ", and current time is", new Date())
  // Validate the webhook's body
  const {errors, isValid} = validatePostMoonpayTransaction(req.body);
  if (!isValid) {
    log.warn("Invalid inputs", errors);
    return res.sendStatus(400).json({ error: errors, success: false });
  }
  try{
    
    // Verify signature
    const signature = req.headers['moonpay-signature'];
    const time = signature.split(",")[0].split("t=")[1];
    const sign = signature.split(",")[1].split("s=")[1];
    const signed_payload = time + "." + JSON.stringify(req.body);
    const secret = process.env.NODE_ENV == "development" ? process.env.TEST_SIGNING : process.env.LIVE_SIGNING
    const hash = crypto.createHmac('sha256', secret).update(signed_payload).digest('hex')
    if(hash != sign) throw "moonpay-signature do not match with the request headers";

    // Create a new object
    const tx = new transaction({
      "moonpayId": req.body.data.id,
      "timeUpdated": new Date(),
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
    // Check if the tx already exists.
    transaction.findOne({"moonpayId": tx.moonpayId}).lean().exec((err, doc) => {
      if (err) { 
        console.log(err); 
        return res.status(500).json({err: err})
      }
      // If not, create a new tx
      if(doc == null){
        tx.save().then(doc=>{
          console.log("doc saved", doc);
          return res.status(201).json({ success: true});
        }).catch(err => console.log(err))
      }
      // If yes, then update the tx.
      else if(doc.moonpayId == tx.moonpayId){
        transaction.replaceOne(doc, tx)
        console.log("doc modified with new data");
        return res.status(201).json({success: true})
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

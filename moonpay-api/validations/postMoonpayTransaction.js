/**
* Validate data in POST /transaction
* @module
* @author Shubham
*/
const validator = require("validator");
const isEmpty = require("./isEmpty");

/**
* Validation of webhook from moonpay in POST /transaction API.
* @param {Object} data Data contains the transaction details
* @returns {Object} An object with potential errors and validity of data
*/
const validatePostMoonpayTransaction = data => {
  const errors = {};
  
  if( validator.isEmpty(data.data.id)){errors.id = "moonpay-id is required"}
  if( validator.isEmpty(data.externalCustomerId)){errors.externalCustomerId = "public_address is required"}
  if( validator.isEmpty(data.data.createdAt)){errors.createdAt = "createdAt is required"}
  if( validator.isEmpty(data.data.updatedAt)){errors.updatedAt = "updatedAt is required"}
  if( !validator.isInt(data.data.baseCurrencyAmount.toString())){errors.baseCurrencyAmount = "baseCurrencyAmount is required"}
  if( validator.isInt(data.data.quoteCurrencyAmount.toString())){errors.quoteCurrencyAmount = "quoteCurrencyAmount is required"}
  if( validator.isInt(data.data.feeAmount.toString())){errors.feeAmount = "feeAmount is required"}
  if( validator.isEmpty(data.data.extraFeeAmount.toString())){errors.extraFeeAmount = "extraFeeAmount is required"}
  if( validator.isEmpty(data.data.status)){errors.status = "status is required"}
  if( validator.isEmpty(data.data.walletAddress)){errors.walletAddress = "walletAddress is required"}
  if( validator.isEmpty(data.data.baseCurrencyId)){errors.baseCurrencyId = "baseCurrencyId is required"}
  if( validator.isEmpty(data.data.currencyId)){errors.currencyId = "currencyId is required"}
  if( validator.isEmpty(data.data.cardId)){errors.cardId = "cardId is required"}
  if( validator.isEmpty(data.data.eurRate.toString())){errors.eurRate = "eurRate is required"}
  if( validator.isInt(data.data.usdRate.toString())){errors.usdRate = "usdRate is required"}
  if( validator.isInt(data.data.gbpRate.toString())){errors.gbpRate = "gbpRate is required"}
  
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validatePostMoonpayTransaction;

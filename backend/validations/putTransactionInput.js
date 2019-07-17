const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress, isHexStrict } = require("web3-utils");

module.exports = validatePutTransactionInput = data => {
  let errors = {};
  data.id = !isEmpty(data.id) ? data.id : "";
  data.created_at = !isEmpty(data.created_at) ? data.created_at : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.to) ? data.to : "";
  data.total_amount = !isEmpty(data.total_amount) ? data.total_amount : "";
  data.currency_amount = !isEmpty(data.currency_amount) ? data.currency_amount : "";
  data.selected_currency = !isEmpty(data.selected_currency) ? data.selected_currency : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.network = !isEmpty(data.network) ? data.network : "";
  data.transaction_hash = !isEmpty(data.transaction_hash) ? data.transaction_hash : "";

    
  if (validator.isEmpty(data.id)) {
    errors.id = "id is required";
  }

  if (validator.isEmpty(data.created_at)) {
    errors.created_at = "created_at is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "from address is required";
  }

  if (validator.isEmpty(data.to)) {
    errors.to = "to address is required";
  }

  if (validator.isEmpty(data.total_amount)) {
    errors.total_amount = "total_amount is required";
  }

  if (validator.isEmpty(data.currency_amount)) {
    errors.currency_amount = "currency_amount is required";
  }

  if (validator.isEmpty(data.selected_currency)) {
    errors.selected_currency = "selected_currency is required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "status is required";
  }

  if (validator.isEmpty(data.network)) {
    errors.network = "network is required";
  }

  if (validator.isEmpty(data.transaction_hash)) {
    errors.transaction_hash = "transaction_hash is required";
  }

  if (data.created_at && isNaN(Date.parse(data.created_at))) {
    errors.created_at = "Not a valid created_at date";
  }

  if (data.from && !isAddress(data.from)) {
    errors.from = "Not a valid public address";
  }

  if (data.to && !isAddress(data.to)) {
    errors.to = "Not a valid public address";
  }

  if (data.transaction_hash && (!isHexStrict(data.transaction_hash) || data.transaction_hash.length !== 66)) {
    errors.transaction_hash = "Not a valid transaction hash";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

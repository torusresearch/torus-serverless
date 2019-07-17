const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress } = require("web3-utils");

module.exports = validatePatchUserInput = data => {
  let errors = {};

  data.public_address = !isEmpty(data.public_address) ? data.public_address : "";
  data.default_currency = !isEmpty(data.default_currency) ? data.default_currency : "";

  if (validator.isEmpty(data.public_address)) {
    errors.public_address = "public_address address is required";
  }

  if (validator.isEmpty(data.default_currency)) {
    errors.default_currency = "default_currency is required";
  }

  if (data.public_address && !isAddress(data.public_address)) {
    errors.public_address = "Not a valid public address";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

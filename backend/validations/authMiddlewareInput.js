const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress } = require("web3-utils");

module.exports = validateAuthMiddlewareInput = data => {
  let errors = {};

  data.public_address = !isEmpty(data.public_address) ? data.public_address : "";

  if (validator.isEmpty(data.public_address)) {
    errors.public_address = "public_address is required and not present in the decoded token";
  }

  if (data.public_address && !isAddress(data.public_address)) {
    errors.public_address = "Not a valid public address";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

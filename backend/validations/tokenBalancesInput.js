const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress } = require("web3-utils");

module.exports = validateTokenBalancesInput = data => {
  let errors = {};

  data.address = !isEmpty(data.address) ? data.address : "";

  if (data.address && !isAddress(data.address)) {
    errors.address = "Not a valid public address";
  }

  if (validator.isEmpty(data.address)) {
    errors.address = "address is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

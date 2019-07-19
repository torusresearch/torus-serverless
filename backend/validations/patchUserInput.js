const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress } = require("web3-utils");

module.exports = validatePatchUserInput = data => {
  let errors = {};

  data.default_currency = !isEmpty(data.default_currency) ? data.default_currency : "";

  if (validator.isEmpty(data.default_currency)) {
    errors.default_currency = "default_currency is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

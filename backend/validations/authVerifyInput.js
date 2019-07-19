const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress, isHexStrict } = require("web3-utils");

module.exports = validateAuthVerifyInput = data => {
  let errors = {};

  data.public_address = !isEmpty(data.public_address) ? data.public_address : "";
  data.signed_message = !isEmpty(data.signed_message) ? data.signed_message : "";

  if (validator.isEmpty(data.public_address)) {
    errors.public_address = "public_address address is required";
  }

  if (validator.isEmpty(data.signed_message)) {
    errors.signed_message = "signed_message is required";
  }

  if (data.public_address && !isAddress(data.public_address)) {
    errors.public_address = "Not a valid public address";
  }

  if (data.signed_message && !isHexStrict(data.signed_message)) {
    errors.signed_message = "Not a valid strict hex string";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

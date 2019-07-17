const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validatePatchTransactionInput = data => {
  let errors = {};

  data.id = !isEmpty(data.id) ? data.id : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  
  if (validator.isEmpty(data.id)) {
    errors.id = "id is required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "status is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

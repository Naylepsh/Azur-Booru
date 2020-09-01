const { register } = require("./register.validator");
const { login } = require("./login.validator");

const userValidators = {
  register,
  login,
};
module.exports = userValidators;

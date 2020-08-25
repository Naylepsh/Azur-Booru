const { User } = require("../../../models/user");

exports.generateAuthToken = function (user) {
  const token = new User(user).generateAuthToken();
  return token;
};

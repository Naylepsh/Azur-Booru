const { Role, ROLES } = require("../../../models/role");
const { User } = require("../../../models/user");
const { EntityCreator } = require("./entityCreator");

exports.UserCreator = class UserCreator extends EntityCreator {
  constructor(password, roles) {
    const props = {
      name: "user",
      password,
      roles,
    };
    const model = User;
    super(model, props);
  }
};

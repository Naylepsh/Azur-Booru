const { Role, ROLES } = require("../../../models/role");
const { User } = require("../../../models/user");
const { EntityCreator } = require("./entityCreator");

exports.UserCreator = class UserCreator extends EntityCreator {
  constructor() {
    const props = {
      name: "user",
      password: "password",
      roles: new Role({ name: ROLES.user }),
    };
    const model = User;
    super(model, props);
  }
};

const { Role, ROLES } = require("../../../models/role");
const { User } = require("../../../models/user");
const { EntityCreator } = require("./entityCreator");
const { randomString } = require("../random-string");

exports.UserCreator = class UserCreator extends EntityCreator {
  static count = 0;

  constructor(password, roles) {
    const props = {
      name: randomString() + UserCreator.count++,
      password,
      roles,
    };
    const model = User;
    super(model, props);
  }
};

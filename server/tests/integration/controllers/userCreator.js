const { Role, ROLES } = require("../../../models/role");
const { User } = require("../../../models/user");

class UserCreator {
  constructor() {
    this.name = "user";
    this.password = "password";
    this.roles = new Role({ name: ROLES.user });
  }

  saveToDatabase() {
    return User.create({
      name: this.name,
      password: this.password,
      roles: this.roles,
    });
  }
}

module.exports = UserCreator;

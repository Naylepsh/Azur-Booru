const { Role, ROLES } = require("../../../models/role");
const { EntityCreator } = require("./entityCreator");

exports.RoleCreator = class RoleCreator extends EntityCreator {
  constructor(name) {
    if (!Object.values(ROLES).includes(name)) {
      throw new Error("Invalid role name");
    }

    const model = Role;
    const props = {
      name,
    };
    super(model, props);
  }
};

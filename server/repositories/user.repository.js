const { Repository } = require("./repository");
const { User } = require("../models/user");

exports.UserRepository = class UserRepository extends Repository {
  constructor() {
    const model = User;
    super(model);
  }

  create(user) {
    const runInTransaction = false;
    return super.create(user, runInTransaction);
  }

  createImpl(user) {
    return this.model.create(user);
  }
};

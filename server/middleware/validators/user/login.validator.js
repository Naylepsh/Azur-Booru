const { validate } = require("../../../models/user");
const { BadRequestException } = require("../../../utils/exceptions");

exports.login = (req, _, next) => {
  const user = req.body;

  const { error } = validate(user);
  if (error) {
    const message = error.details[0].message;
    throw new BadRequestException(message);
  }

  next();
};

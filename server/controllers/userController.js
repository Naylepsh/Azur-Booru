const { User, validate } = require("../models/user");
const Role = require("../models/role");
const { sendError } = require("../utils/misc");
const { hashPassword, validatePassword } = require("../utils/auth");
const config = require("../config");

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return sendError(res, { status: 400, message: error.details[0].message });
  }

  let user = await User.findOne({ name: req.body.name });
  if (user) {
    return sendError(res, { status: 400, message: "User already registered." });
  }

  const { password } = await hashPassword(req.body.password);
  const role = await Role.user();

  const savedUser = await User.create({
    name: req.body.name,
    password,
    roles: [role._id],
  });

  res.send(savedUser);
};

exports.login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return sendError(res, { status: 400, message: error.details[0].message });
  }

  const user = await User.findOne({ name: req.body.name });
  if (!user) {
    return sendError(res, {
      status: 400,
      message: "Invalid username or password.",
    });
  }

  const validPassword = await validatePassword(
    req.body.password,
    user.password
  );
  if (!validPassword) {
    return sendError(res, {
      status: 400,
      message: "Invalid username or password.",
    });
  }

  const jwt = user.generateAuthToken();
  const roleNames = await Role.getRoleNames(user.roles);
  storeRoles(res, roleNames);

  res.send({ jwt });
};

exports.logout = (req, res) => {
  res.clearCookie("jwt-token");
  const prefix = config.cookies.prefix;
  for (const key in req.cookies) {
    if (key.slice(0, prefix.length) === prefix) {
      res.clearCookie(key);
    }
  }
  res.user = null;
  res.send("Successfully logged out");
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user._id);
  delete user.password;
  res.send(user);
};

async function storeRoles(res, roles) {
  for (const role of roles) {
    res.cookie(config.cookies.prefix + role, true, {
      expire: 400000 + Date.now(),
    });
  }
}

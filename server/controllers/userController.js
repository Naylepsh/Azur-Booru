const { User, validate } = require("../models/user");
const Role = require("../models/role");
const { hashPassword, validatePassword } = require("../utils/auth");
const config = require("../config");
const { BadRequestException } = require("../utils/exceptions");

exports.register = async (req, res) => {
  ensurePayloadIsValid(req.body, validate);
  await ensureUserDoesNotExist(req.body.name);

  const { password } = await hashPassword(req.body.password);
  const role = await Role.user();

  const savedUser = await User.create({
    name: req.body.name,
    password,
    roles: [role._id],
  });

  res.send(savedUser);
};

async function ensureUserDoesNotExist(name) {
  let user = await User.findOne({ name });
  if (user) {
    const message = "User already registered";
    throw new BadRequestException(message);
  }
}

exports.login = async (req, res) => {
  ensurePayloadIsValid(req.body, validate);
  const user = await ensureUserDoesExist(req.body.name);
  await ensurePasswordMatches(req.body.password, user.password);

  const jwt = user.generateAuthToken();
  const roleNames = await Role.getRoleNames(user.roles);
  storeRoles(res, roleNames);

  res.send({ jwt });
};

function ensurePayloadIsValid(payload, validate) {
  const { error } = validate(payload);
  if (error) {
    const message = error.details[0].message;
    throw new BadRequestException(message);
  }
}

async function ensureUserDoesExist(name) {
  const user = await User.findOne({ name });
  if (!user) {
    const message = "Invalid username or password.";
    throw new BadRequestException(message);
  }
  return user;
}

async function ensurePasswordMatches(providedPassword, hashedPassword) {
  const validPassword = await validatePassword(
    providedPassword,
    hashedPassword
  );
  if (!validPassword) {
    const message = "Invalid username or password.";
    throw new BadRequestException(message);
  }
}

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

function storeRoles(res, roles) {
  for (const role of roles) {
    res.cookie(config.cookies.prefix + role, true, {
      expire: 400000 + Date.now(),
    });
  }
}

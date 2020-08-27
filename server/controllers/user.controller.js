const { User, validate } = require("../models/user");
const Role = require("../models/role");
const { hashPassword, validatePassword } = require("../utils/auth");
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
  const user = await ensureUserDoesExist({ name: req.body.name });
  await ensurePasswordMatches(req.body.password, user.password);

  const jwt = user.generateAuthToken();

  res.send({ jwt });
};

function ensurePayloadIsValid(payload, validate) {
  const { error } = validate(payload);
  if (error) {
    const message = error.details[0].message;
    throw new BadRequestException(message);
  }
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

exports.profile = async (req, res) => {
  const user = await ensureUserDoesExist({ id: req.user._id });
  const userProps = { ...user._doc };
  delete userProps.password;

  res.send(userProps);
};

async function ensureUserDoesExist({ name, id }) {
  if (!name && !id)
    throw new Error("Cannot find a user when both name and id are missing");

  const user = name ? await User.findOne({ name }) : await User.findById(id);
  if (!user) {
    const message = "Invalid username or password.";
    throw new BadRequestException(message);
  }

  return user;
}

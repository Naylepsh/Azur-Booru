const { hashPassword, validatePassword } = require("../../utils/auth");
const { BadRequestException } = require("../../utils/exceptions");
const { User } = require("../../models/user");
const Role = require("../../models/role");

module.exports = class UserService {
  async register(userDTO) {
    await ensureUserDoesNotExist(userDTO.name);

    const { password } = await hashPassword(userDTO.password);
    const role = await Role.user();

    const savedUser = await User.create({
      name: userDTO.name,
      password,
      roles: [role._id],
    });

    return savedUser;
  }

  async login({ name, password }) {
    const user = await ensureUserDoesExist({ name });
    await ensurePasswordMatches(password, user.password);

    const jwt = user.generateAuthToken();

    return jwt;
  }

  async getProfile(id) {
    const user = await ensureUserDoesExist({ id });
    const userProps = { ...user._doc };
    delete userProps.password;

    return userProps;
  }
};

async function ensureUserDoesNotExist(name) {
  let user = await User.findOne({ name });
  if (user) {
    const message = "User already registered";
    throw new BadRequestException(message);
  }
}

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

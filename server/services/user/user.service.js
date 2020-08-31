const { hashPassword, validatePassword } = require("../../utils/auth");
const { BadRequestException } = require("../../utils/exceptions");
const Role = require("../../models/role");
const { UserRepository } = require("../../repositories/user.repository");

module.exports = class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async register(userDTO) {
    const user = await this.repository.findOne({ name: userDTO.name });
    ensureUserNotRegistered(user);

    const { password } = await hashPassword(userDTO.password);
    const role = await Role.user();
    const userData = {
      name: userDTO.name,
      password,
      roles: [role._id],
    };

    return this.repository.create(userData);
  }

  async login({ name, password }) {
    const user = await this.repository.findOne({ name });
    ensureUserDoesExist(user);
    await ensurePasswordMatches(password, user.password);

    const jwt = user.generateAuthToken();

    return jwt;
  }

  async getProfile(id) {
    const user = await this.repository.findById(id);
    ensureUserDoesExist(user);
    const userProps = { ...user._doc };
    delete userProps.password;

    return userProps;
  }
};

function ensureUserNotRegistered(user) {
  if (user) {
    const message = "User already registered";
    throw new BadRequestException(message);
  }
}

function ensureUserDoesExist(user) {
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

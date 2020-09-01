const UserService = require("../services/user/user.service");

exports.UserController = class UserController {
  constructor() {
    this.userService = new UserService();
  }

  login = async (req, res) => {
    const userDTO = req.body;

    const jwt = await this.userService.login(userDTO);

    res.send({ jwt });
  };

  register = async (req, res) => {
    const userDTO = req.body;

    const user = await this.userService.register(userDTO);

    res.send(user);
  };

  profile = async (req, res) => {
    const id = req.user._id;

    const profile = await this.userService.getProfile(id);

    res.send(profile);
  };
};

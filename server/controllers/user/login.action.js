const UserService = require("../../services/user/user.service");

const userService = new UserService();

exports.login = async (req, res) => {
  const userDTO = req.body;

  const jwt = await userService.login(userDTO);

  res.send({ jwt });
};

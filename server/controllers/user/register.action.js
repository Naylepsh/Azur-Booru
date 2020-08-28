const UserService = require("../../services/user/user.service");

const userService = new UserService();

exports.register = async (req, res) => {
  const userDTO = req.body;

  const user = await userService.register(userDTO);

  res.send(user);
};

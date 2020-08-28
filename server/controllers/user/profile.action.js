const UserService = require("../../services/user/user.service");

const userService = new UserService();

exports.profile = async (req, res) => {
  const id = req.user._id;

  const profile = await userService.getProfile(id);

  res.send(profile);
};

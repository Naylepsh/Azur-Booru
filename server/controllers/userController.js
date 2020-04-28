const { User, validate } = require("../models/user");
const Role = require("../models/role");
const { sendError } = require("../utils/misc");
const { hashPassword, validatePassword } = require("../utils/auth");
const config = require("../config");

exports.registerForm = (req, res) => {
  if (req.user) {
    res.redirect("/");
  }
  res.render("user/register", { user: req.user });
};

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return sendError(res, { status: 400, message: error.details[0].message });
  }

  let user = await User.findOne({ name: req.body.name });
  if (user) {
    return sendError(res, { status: 400, message: "User already registered." });
  }

  const { salt, password } = await hashPassword(req.body.password);
  const role = await Role.user();
  user = new User({
    name: req.body.name,
    password,
    roles: [role._id],
  });
  await user.save();
};

exports.loginForm = (req, res) => {
  if (req.user) {
    res.redirect("/");
  }
  res.render("user/login", { user: req.user });
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

  const token = user.generateAuthToken();
  res.cookie("jwt-token", token, { expire: 400000 + Date.now() });
  const roleNames = await Role.getRoleNames(user.roles);
  storeRoles(res, roleNames);

  res.send({ token });
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
  // TODO: DO NOT SEND PASSWORD!
  const user = await User.findById(req.user._id);
  res.send(user);
};

async function storeRoles(res, roles) {
  for (const role of roles) {
    res.cookie(config.cookies.prefix + role, true, {
      expire: 400000 + Date.now(),
    });
  }
}

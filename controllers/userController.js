const { User, validate } = require('../models/user');
const { sendError } = require('../utils/misc');
const { hashPassword } = require('../utils/auth');

exports.registerForm = (req, res) => {
  res.render('user/register');
}

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) { sendError(res, { status: 400, message: error.details[0].message }) };

  let user = await User.findOne({ name: req.body.name });
  if (user) { sendError(res, { status: 400, message: 'User already registered.' }) };

  const { salt, password } = await hashPassword(req.body.password);
  user = new User({
    name: req.body.name,
    password: password
  });
  await user.save();
  res.send(user);
}

exports.loginForm = (req, res) => {
  res.render('user/login');
}

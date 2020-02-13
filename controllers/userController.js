const { User, validate } = require('../models/user');
const { sendError } = require('../utils/misc');
const { hashPassword, validatePassword } = require('../utils/auth');

exports.registerForm = (req, res) => {
  if (req.user) { res.redirect('/'); }
  res.render('user/register', { user: req.user });
}

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) { 
    return sendError(res, { status: 400, message: error.details[0].message });
  };

  let user = await User.findOne({ name: req.body.name });
  if (user) { 
    return sendError(res, { status: 400, message: 'User already registered.' });
  };

  const { salt, password } = await hashPassword(req.body.password);
  user = new User({
    name: req.body.name,
    password: password
  });
  await user.save();
  res.send(user);
}

exports.loginForm = (req, res) => {
  if (req.user) { res.redirect('/'); }
  res.render('user/login', { user: req.user });
}

exports.login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return sendError(res, { status: 400, message: error.details[0].message });
  };

  const user = await User.findOne({ name: req.body.name });
  if (!user) { 
    return sendError(res, { status: 400, message: 'Invalid username or password.' });
  }

  const validPassword = await validatePassword(req.body.password, user.password);
  if (!validPassword) { 
    return sendError(res, { status: 400, message: 'Invalid username or password.' });
  }

  const token = user.generateAuthToken();
  res.cookie('jwt-token', token, {expire: 400000 + Date.now()});

  res.send(token);
}

exports.logout = (req, res) => {
  res.clearCookie('jwt-token');
  res.user = null;
  res.redirect('/');
}

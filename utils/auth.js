const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(16);
  const hash = await bcrypt.hash(password, salt);
  return { salt, password: hash };
}

exports.hashPassword = hashPassword;

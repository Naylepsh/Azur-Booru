const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  return { salt, password: hash };
}

async function validatePassword(givenPassword, hashedPassword) {
  return await bcrypt.compare(givenPassword, hashedPassword);
}

exports.hashPassword = hashPassword;
exports.validatePassword = validatePassword;

const { sendError } = require('../utils/misc');

module.exports = (err, req, res, next) => {
  console.error(err);
  sendError(res, { status: 500, message: 'Something went wrong.' });
}
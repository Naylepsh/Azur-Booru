const { sendError } = require('../utils/misc');

module.exports = (err, req, res, next) => {
  for (const handler of res.locals.error_handlers) {
    handler();
  }
  console.error(err);
  sendError(res, { status: 500, message: 'Something went wrong.' });
}
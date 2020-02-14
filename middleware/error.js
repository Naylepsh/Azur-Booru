const { sendError } = require('../utils/misc');

module.exports = (err, req, res, next) => {
  for (const handler of req.locals.error_handlers) {
    handler();
  }
  sendError(res, { status: 500, message: 'Something went wrong.' });
}
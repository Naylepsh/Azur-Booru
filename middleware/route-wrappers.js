/**
 * Wraps try / catch block around route handler.
 * Only 0-ary functions in error_handlers are passed to
 * error handling middleware
 */
exports.asyncWrapper = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  }
}
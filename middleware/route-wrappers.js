/**
 * Wraps try / catch block around route handler.
 * Only 0-ary functions in error_handlers are passed to
 * error handling middleware
 */
exports.asyncWrapper = (handler, error_handlers) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (error_handlers && error_handlers.length > 0) {
        res.locals.error_handlers = error_handlers.filter( f => typeof f === 'function' && f.length == 0 );
      }
      if (!res.locals.error_handlers) {
        res.locals.error_handlers = [];
      }
      next(err);
    }
  }
}
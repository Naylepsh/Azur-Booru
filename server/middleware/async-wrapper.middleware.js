const handleError = require("./error.middleware");

module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      return handleError(err, req, res);
    }
  };
};

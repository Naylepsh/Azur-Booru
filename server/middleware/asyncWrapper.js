const handleError = require("./error");

module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      return handleError(err, req, res);
    }
  };
};

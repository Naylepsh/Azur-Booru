const { sendError } = require("../utils/misc");

module.exports = (err, req, res, next) => {
  const { status, message } = err;
  console.log(message);
  if (status === 404) {
    res.redirect("/not-found");
  } else {
    res.redirect("/internal-error");
  }
};

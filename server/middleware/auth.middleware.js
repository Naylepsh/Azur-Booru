const jwt = require("jsonwebtoken");
const config = require("../config");

exports.authorizeUser = function (req, res, next) {
  if (!config.requireAuth) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
